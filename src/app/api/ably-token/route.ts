import { NextRequest, NextResponse } from "next/server";
import Ably from "ably";

export async function POST(request: NextRequest) {
  try {
    if (!process.env.ABLY_API_KEY) {
      console.error("ABLY_API_KEY is not configured");
      return NextResponse.json(
        { error: "Ably configuration missing" },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    if (!formData.has("clientId")) {
      return NextResponse.json(
        { error: "No client id specified" },
        { status: 400 }
      );
    }

    const clientId = formData.get("clientId")?.toString();

    const ably = new Ably.Rest(process.env.ABLY_API_KEY);

    const tokenRequest = await ably.auth.createTokenRequest({
      clientId,
      capability: {
        "game:*": ["subscribe", "publish"], // Allow access to game channels
      },
      // TODO ttl?
      ttl: 60 * 60 * 1000, // 1 hour
    });

    return NextResponse.json(tokenRequest);
  } catch (error) {
    console.error("Error creating Ably token request:", error);
    return NextResponse.json(
      { error: "Failed to create token request" },
      { status: 500 }
    );
  }
}
