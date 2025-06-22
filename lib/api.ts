import type { Session } from "next-auth";
import type { TokenResponse } from "../types/common";
import { createFetchClient } from "@zayne-labs/callapi";
import { getSession } from "next-auth/react";
import { auth } from "../auth";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL!;

async function getGuestToken() {
  try {
    const url =
      typeof window === "undefined"
        ? `${process.env.NEXT_PUBLIC_APP_URL}/api/access-token`
        : "/api/access-token";

    const response = await fetch(url, { method: "POST" });
    if (!response.ok) throw new Error("Failed to fetch guest token");
    const data: TokenResponse = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Guest token fetch failed:", error);
    throw error;
  }
}

export const callBackend = createFetchClient({
  baseURL,
  auth: {
    bearer: async () => {
      let session: Session | null = null;
      const guestToken = await getGuestToken();

      if (typeof window === "undefined") {
        session = await auth();
      } else {
        session = await getSession();
      }

      return session?.access_token || guestToken;
    },
  },
  throwOnError: true,
  resultMode: "onlySuccessWithException",
});
