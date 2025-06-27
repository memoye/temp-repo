import { getSession } from "next-auth/react";
import { createFetchClient } from "@zayne-labs/callapi";
import { auth } from "../auth";
import type { Session } from "next-auth";
import type { ApiResponse, TokenResponse } from "../types/common";

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

// For auth endpoints
export const authCall = createFetchClient({
  baseURL,
  auth: {
    bearer: async () => {
      let session: Session | null = null;

      if (typeof window === "undefined") {
        session = await auth();
      } else {
        session = await getSession();
      }

      return session?.access_token;
    },
  },

  throwOnError: true,
  resultMode: "onlySuccessWithException",
  onError: (res) => {
    const status = res.response?.status;
    const errCode = (res?.error?.originalError as unknown as ApiResponse<"">)?.code;
    if (errCode || status)
      throw new Error(
        `Request failed ${status ? `- ${status ?? ""}` : ""}: ` + (errCode ?? ""),
      );
    else throw new Error("An unexpected error occured");
  },
});

// For open endpoints
export const openCall = createFetchClient({
  baseURL,
  auth: {
    bearer: async () => {
      const guestToken = await getGuestToken();
      return guestToken;
    },
  },
  throwOnError: true,
  resultMode: "onlySuccessWithException",
  onError: (res) => {
    const status = res.response?.status;
    const errCode = (res?.error?.originalError as unknown as ApiResponse<"">)?.code;
    if (errCode || status)
      throw new Error(
        `Request failed ${status ? `- ${status ?? ""}` : ""}: ` + (errCode ?? ""),
      );
    else throw new Error("An unexpected error occured");
  },
});
