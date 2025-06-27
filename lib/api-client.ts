import { auth } from "@/auth";
import { TokenResponse } from "@/types/common";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL!;

// Token cache to avoid unnecessary requests
let guestTokenCache: { token: string; expires: number } | null = null;

async function getGuestToken(): Promise<string> {
  // Check if we have a valid cached token
  if (guestTokenCache && Date.now() < guestTokenCache.expires) {
    return guestTokenCache.token;
  }

  try {
    const url =
      typeof window === "undefined"
        ? `${process.env.NEXT_PUBLIC_APP_URL}/api/access-token`
        : "/api/access-token";

    const response = await fetch(url, {
      method: "POST",
      cache: "no-store", // Ensure fresh token requests
    });

    if (!response.ok) throw new Error("Failed to fetch guest token");

    const data: TokenResponse = await response.json();

    // Cache the token (assuming 1 hour expiry, adjust as needed)
    guestTokenCache = {
      token: data.access_token,
      expires: Date.now() + 55 * 60 * 1000, // 55 minutes to be safe
    };

    return data.access_token;
  } catch (error) {
    console.error("Guest token fetch failed:", error);
    throw error;
  }
}

async function getUserToken(): Promise<string | null> {
  try {
    // For Server Components
    if (typeof window === "undefined") {
      const session = await auth();
      return (session?.access_token as string) || null;
    }

    // For Client Components
    const { getSession } = await import("next-auth/react");
    const session = await getSession();
    return (session?.access_token as string) || null;
  } catch (error) {
    console.error("Failed to get user token:", error);
    return null;
  }
}

interface ApiClientOptions {
  requireAuth?: boolean;
  service?: string;
  headers?: Record<string, string>;
}

class ApiClient {
  private async getAuthHeaders(requireAuth = false): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (requireAuth) {
      const userToken = await getUserToken();
      if (!userToken) {
        throw new Error("Authentication required but no user token available");
      }
      headers.Authorization = `Bearer ${userToken}`;
    } else {
      // Use guest token for open endpoints
      const guestToken = await getGuestToken();
      headers.Authorization = `Bearer ${guestToken}`;
    }

    return headers;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit & ApiClientOptions = {},
  ): Promise<T> {
    const { requireAuth = false, service, headers: customHeaders, ...fetchOptions } = options;

    try {
      const authHeaders = await this.getAuthHeaders(requireAuth);
      const url = service ? `${baseURL}/${service}${endpoint}` : `${baseURL}${endpoint}`;

      const response = await fetch(url, {
        ...fetchOptions,
        headers: {
          ...authHeaders,
          ...customHeaders,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Clear guest token cache on 401
          guestTokenCache = null;
          throw new Error("Authentication failed");
        }
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      // Handle empty responses
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return await response.json();
      }

      return (await response.text()) as unknown as T;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // GET request
  async get<T>(endpoint: string, options: ApiClientOptions = {}): Promise<T> {
    return this.makeRequest<T>(endpoint, { ...options, method: "GET" });
  }

  // POST request
  async post<T>(endpoint: string, data?: any, options: ApiClientOptions = {}): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT request
  async put<T>(endpoint: string, data?: any, options: ApiClientOptions = {}): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string, options: ApiClientOptions = {}): Promise<T> {
    return this.makeRequest<T>(endpoint, { ...options, method: "DELETE" });
  }

  // PATCH request
  async patch<T>(endpoint: string, data?: any, options: ApiClientOptions = {}): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

export const apiClient = new ApiClient();
