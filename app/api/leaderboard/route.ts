import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { getLatestLeaderboardSnapshot } from "@/lib/leaderboard-query";
import { createClient } from "@/utils/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const latestLeaderboard = await getLatestLeaderboardSnapshot(supabase);

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
