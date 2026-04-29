import dotenv from "dotenv";

import { Prisma } from "@/generated/prisma/client";
import {
  generateMockCreatorPerformanceDataset,
  normalizeSourceDate,
} from "@/lib/mock-generator";
import { rankCreatorRevenueRows } from "@/lib/ranking-engine";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: ".env.local" });
dotenv.config();

type SourceRow = {
  id: string;
  full_name: string;
  revenue_generated: string | number;
};

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`${name} is required.`);
  }
  return value;
}

function toDateOnly(value: Date): string {
  return value.toISOString().slice(0, 10);
}

async function refreshLeaderboardFromSupabase(): Promise<{
  sourceDate: Date;
  snapshotDate: Date;
  sourceRowCount: number;
  snapshotRowCount: number;
  createdSourceRows: number;
  updatedSourceRows: number;
}> {
  const supabaseUrl = getRequiredEnv("NEXT_PUBLIC_SUPABASE_URL");
  const supabaseServiceRoleKey = getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY");
  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
  const snapshotDate = normalizeSourceDate();
  const snapshotDateOnly = toDateOnly(snapshotDate);

  const { data: existingRows, error: existingRowsError } = await supabase
    .from("creator_performance_source")
    .select("id,full_name,revenue_generated")
    .overrideTypes<SourceRow[], { merge: false }>();

  if (existingRowsError !== null) {
    throw new Error(
      `Failed to load source rows from Supabase: ${existingRowsError.message}`,
    );
  }

  const existingRowsByName = new Map(
    existingRows.map((row) => [row.full_name, row]),
  );
  const generatedRows = generateMockCreatorPerformanceDataset(
    { sourceDate: snapshotDate },
    existingRows.map((row) => ({
      id: row.id,
      fullName: row.full_name,
      revenueGenerated: new Prisma.Decimal(row.revenue_generated),
    })),
  );

  let createdSourceRows = 0;
  let updatedSourceRows = 0;

  for (const row of generatedRows) {
    const existingRow = existingRowsByName.get(row.fullName);
    if (typeof existingRow === "undefined") {
      const { error } = await supabase.from("creator_performance_source").insert({
        full_name: row.fullName,
        revenue_generated: Number(row.revenueGenerated.toString()),
        source_date: snapshotDateOnly,
      });
      if (error !== null) {
        throw new Error(`Failed to insert source row: ${error.message}`);
      }
      createdSourceRows += 1;
      continue;
    }

    const { error } = await supabase
      .from("creator_performance_source")
      .update({
        full_name: row.fullName,
        revenue_generated: Number(row.revenueGenerated.toString()),
        source_date: snapshotDateOnly,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existingRow.id);
    if (error !== null) {
      throw new Error(`Failed to update source row: ${error.message}`);
    }
    updatedSourceRows += 1;
  }

  const { data: sourceRows, error: sourceRowsError } = await supabase
    .from("creator_performance_source")
    .select("id,full_name,revenue_generated")
    .overrideTypes<SourceRow[], { merge: false }>();

  if (sourceRowsError !== null) {
    throw new Error(
      `Failed to read refreshed source rows: ${sourceRowsError.message}`,
    );
  }

  const rankedRows = rankCreatorRevenueRows(
    sourceRows.map((row) => ({
      id: row.id,
      fullName: row.full_name,
      revenueGenerated: row.revenue_generated,
    })),
  );

  const { error: deleteSnapshotError } = await supabase
    .from("leaderboard_daily_snapshot")
    .delete()
    .eq("snapshot_date", snapshotDateOnly);

  if (deleteSnapshotError !== null) {
    throw new Error(
      `Failed to clear existing snapshot rows: ${deleteSnapshotError.message}`,
    );
  }

  const { error: insertSnapshotError } = await supabase
    .from("leaderboard_daily_snapshot")
    .insert(
      rankedRows.map((row) => ({
        source_id: row.id,
        snapshot_date: snapshotDateOnly,
        revenue_generated: Number(row.revenueGenerated.toString()),
        rank_position: row.rankPosition,
      })),
    );

  if (insertSnapshotError !== null) {
    throw new Error(
      `Failed to insert snapshot rows: ${insertSnapshotError.message}`,
    );
  }

  return {
    sourceDate: snapshotDate,
    snapshotDate,
    sourceRowCount: sourceRows.length,
    snapshotRowCount: rankedRows.length,
    createdSourceRows,
    updatedSourceRows,
  };
}

async function main(): Promise<void> {
  const result = await refreshLeaderboardFromSupabase();

  console.info("Leaderboard refresh completed.");
  console.info(
    JSON.stringify(
      {
        sourceDate: result.sourceDate.toISOString(),
        snapshotDate: result.snapshotDate.toISOString(),
        sourceRowCount: result.sourceRowCount,
        snapshotRowCount: result.snapshotRowCount,
        createdSourceRows: result.createdSourceRows,
        updatedSourceRows: result.updatedSourceRows,
      },
      null,
      2,
    ),
  );
}

main()
  .catch((error: unknown) => {
    console.error("Leaderboard refresh failed.", error);
    process.exitCode = 1;
  });
