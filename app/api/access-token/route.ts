import { NextResponse } from "next/server";

export async function POST() {
  try {
    const formData = new URLSearchParams();
    formData.append("client_id", process.env.GUEST_CLIENT_ID!);
    formData.append("client_secret", process.env.CLIENT_SECRET!);
    formData.append("grant_type", "client_credentials");

    const response = await fetch(`${process.env.AUTH_ISSUER!}/connect/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0",
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Auth server error: ${errorText}`);
    }

    return NextResponse.json(await response.json());
  } catch (error: any) {
    console.error("Token request failed:", error);
    return NextResponse.json(
      { error: "Failed to get token", details: error.message },
      { status: 500 },
    );
  }
}
