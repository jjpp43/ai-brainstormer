//import { NextRequest, NextResponse } from "next/server";
import { currentUser, auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { NextResponse } from "next/server";
const MAX_REQUESTS = 10;
const TIMEZONE_OFFSET = -4; // EDT

const getMidnightTimestamp = () => {
  const now = new Date();
  now.setUTCHours(24 + TIMEZONE_OFFSET, 0, 0, 0); // Next midnight EDT
  return now.getTime();
};

export async function POST(req: Request) {
  try {
    const { userId } = await auth(); // get the current user ID
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    // ✅ Fetch the user from Clerk
    const user = await clerkClient.users.getUser(userId);

    const metadata = user.privateMetadata ?? {};
    let tokens = metadata.tokens ?? MAX_REQUESTS;
    let lastReset = metadata.lastReset ?? 0;

    const now = Date.now();
    const midnightTimestamp = getMidnightTimestamp();

    // Reset tokens if past midnight
    if (now >= midnightTimestamp) {
      tokens = MAX_REQUESTS;
      lastReset = midnightTimestamp;
    }
    // Check if the user has tokens available
    // Comment the if clause below for testing purposes. Once the test is over, uncomment it.
    // if (typeof tokens === "number" && tokens <= 0) {
    //   return NextResponse.json(
    //     { error: "Daily limit reached" },
    //     { status: 403 }
    //   );
    // }
    // Deduct 1 token
    tokens = Number(tokens) - 1;

    // ✅ Correct way to update private metadata
    await clerkClient.users.updateUserMetadata(userId, {
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
