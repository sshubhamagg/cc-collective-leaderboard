import { NextResponse } from "next/server";

import { getLatestLeaderboardSnapshot } from "@/lib/leaderboard-query";
import { getPrismaClient } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
  try {
    const latestLeaderboard =
      await getLatestLeaderboardSnapshot(getPrismaClient());

    return NextResponse.json(latestLeaderboard.entries, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Leaderboard snapshot retrieval failed.", error);

    return NextResponse.json(
      {
        error: "Leaderboard snapshot retrieval failed.",
      },
      { status: 500 },
    );
  }
}
