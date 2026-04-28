import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { getPrismaClient } from "@/lib/prisma";
import { refreshLeaderboard } from "@/lib/refresh-leaderboard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isAuthorized(request: NextRequest): boolean {
  const cronSecret = process.env.CRON_SECRET;

  if (typeof cronSecret !== "string" || cronSecret.length === 0) {
    return true;
  }

  const authorizationHeader = request.headers.get("authorization");

  return authorizationHeader === `Bearer ${cronSecret}`;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      {
        success: false,
        error: "Unauthorized.",
      },
      { status: 401 },
    );
  }

  try {
    const result = await refreshLeaderboard(getPrismaClient());

    return NextResponse.json(
      {
        success: true,
        sourceDate: result.sourceDate.toISOString(),
        snapshotDate: result.snapshotDate.toISOString(),
        sourceRowCount: result.sourceRowCount,
        snapshotRowCount: result.snapshotRowCount,
        createdSourceRows: result.createdSourceRows,
        updatedSourceRows: result.updatedSourceRows,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    console.error("Leaderboard refresh failed.", error);

    return NextResponse.json(
      {
        success: false,
        error: "Leaderboard refresh failed.",
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }
}
