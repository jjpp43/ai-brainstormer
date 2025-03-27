import { NextRequest, NextResponse } from "next/server";
import { currentUser, clerkClient } from "@clerk/nextjs/server";

const MAX_REQUESTS = 10;
const TIMEZONE_OFFSET = -4; // EDT

const getMidnightTimestamp = () => {
  const now = new Date();
  now.setUTCHours(24 + TIMEZONE_OFFSET, 0, 0, 0); // Next midnight EDT
  return now.getTime();
};

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    const clerk = await clerkClient();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = user.id;
    const metadata = await clerkClient.prototype; // ✅ Correct method

    let tokens = metadata.privateMetadata?.tokens ?? MAX_REQUESTS;
    let lastReset = metadata.privateMetadata?.lastReset ?? 0;
    const now = Date.now();
    const midnightTimestamp = getMidnightTimestamp();

    // Reset tokens if past midnight
    if (now >= midnightTimestamp) {
      tokens = MAX_REQUESTS;
      lastReset = midnightTimestamp;
    }

    // Check if the user has tokens available
    if (tokens <= 0) {
      return NextResponse.json(
        { error: "Daily limit reached" },
        { status: 403 }
      );
    }

    // Deduct 1 token
    tokens -= 1;

    // ✅ Correct way to update private metadata
    await clerk.users.updateUserMetadata(userId, {
      privateMetadata: {
        tokens,
        lastReset,
      },
    });

    return NextResponse.json({ success: true, tokens });
  } catch (error) {
    console.error("❌ Error deducting token:", error);
    return NextResponse.json(
      { error: "Error updating tokens" },
      { status: 500 }
    );
  }
}
