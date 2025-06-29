import { auth } from "@/auth";
import type { ApiResponse, Service, TokenResponse } from "@/types/common";
import { tokenManager } from "./token-manager";
import { devLog, flattenToSearchParams } from "./utils";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
const apiVersion = process.env.NEXT_PUBLIC_API_VERSION;

async function getGuestToken(): Promise<string> {
  // Check if we have a valid cached token
  const cachedToken = tokenManager.getCachedGuestToken();
  if (cachedToken) {
    return cachedToken;
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

    // Cache the token using the token manager
    tokenManager.cacheGuestToken(data);

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
  service?: Service;
  headers?: Record<string, string>;
}

export class ApiError extends Error {
  constructor(
    public response: Omit<ApiResponse<null>, "message"> & { message: string },
    public status: number,
  ) {
    super(response.message);
    this.name = "ApiError";
  }
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
  ): Promise<ApiResponse<T>> {
    const { requireAuth = false, service, headers: customHeaders, ...fetchOptions } = options;

    try {
      const authHeaders = await this.getAuthHeaders(requireAuth);
      const url = service
        ? `${baseURL}/${service}/api/v${apiVersion}${endpoint === "/" ? "" : endpoint}`
        : `${baseURL}${endpoint === "/" ? "" : endpoint}`;

      const response = await fetch(url, {
        ...fetchOptions,
        headers: {
          ...authHeaders,
          ...customHeaders,
        },
      });

      const contentType = response.headers.get("content-type");
      const isJson = contentType && contentType.includes("application/json");

      if (!response.ok) {
        let errorData: ApiError["response"] | null = null;

        try {
          errorData = isJson ? await response.json() : null;
        } catch (e) {
          // Failed to parse error response
          devLog("Failed to parse error response:", e);
          errorData = {
            message: `API request failed: ${response.status} ${response.statusText}`,
            code: 1,
            errors: null,
            payload: null,
            totalCount: 0,
          };
        }

        if (response.status === 401) {
          // Clear guest token cache on 401
          tokenManager.clearGuestToken();
          throw new Error("Authentication failed");
        }

        throw new ApiError(
          errorData || {
            payload: null,
            message: `API request failed: ${response.status} ${response.statusText}`,
            totalCount: 0,
            code: response.status,
            errors: null,
          },
          response.status,
        );
      }

      // Handle empty responses
      if (isJson) {
        return await response.json();
      }

      return (await response.text()) as unknown as ApiResponse<T>;
    } catch (error) {
      console.error(`API request failed for ${service}${endpoint}:`, error);
      throw error;
    }
  }

  // GET request
  async get<T, P = unknown>(
    endpoint: string,
    options: ApiClientOptions & { params?: string | Record<string, any> | P } = {},
  ): Promise<ApiResponse<T>> {
    const { params, ...opts } = options;
    if (params) {
      if (!endpoint.includes("?")) endpoint += "?";

      endpoint += typeof params === "string" ? params : flattenToSearchParams(params);
    }

    return this.makeRequest<T>(endpoint, { requireAuth: true, ...opts, method: "GET" });
  }

  // POST request
  async post<T, D = any, P = unknown>(
    endpoint: string,
    data?: D,
    options: ApiClientOptions & { params?: string | Record<string, any> | P } = {},
  ): Promise<ApiResponse<T>> {
    const { params, ...opts } = options;
    if (params) {
      if (!endpoint.includes("?")) endpoint += "?";

      endpoint += typeof params === "string" ? params : flattenToSearchParams(params);
    }

    return this.makeRequest<T>(endpoint, {
      requireAuth: true,
      ...opts,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT request
  async put<T, D = any, P = unknown>(
    endpoint: string,
    data?: D,
    options: ApiClientOptions & { params?: string | Record<string, any> | P } = {},
  ): Promise<ApiResponse<T>> {
    const { params, ...opts } = options;
    if (params) {
      if (!endpoint.includes("?")) endpoint += "?";

      endpoint += typeof params === "string" ? params : flattenToSearchParams(params);
    }

    return this.makeRequest<T>(endpoint, {
      requireAuth: true,
      ...opts,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  async delete<T, D = any, P = unknown>(
    endpoint: string,
    data?: D,
    options: ApiClientOptions & { params?: string | Record<string, any> | P } = {},
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      requireAuth: true,
      ...options,
      body: data ? JSON.stringify(data) : undefined,
      method: "DELETE",
    });
  }

  // PATCH request
  async patch<T, D = any, P = unknown>(
    endpoint: string,
    data?: D,
    options: ApiClientOptions & { params?: string | Record<string, any> | P } = {},
  ): Promise<ApiResponse<T>> {
    const { params, ...opts } = options;
    if (params) {
      if (!endpoint.includes("?")) endpoint += "?";

      endpoint += typeof params === "string" ? params : flattenToSearchParams(params);
    }

    return this.makeRequest<T>(endpoint, {
      requireAuth: true,
      ...opts,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

export const api = new ApiClient();

export async function makeExternalRequest<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const { headers, ...fetchOptions } = options;

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers: { ...headers },
    });

    const contentType = response.headers.get("content-type");
    const isJson = contentType && contentType.includes("application/json");

    if (!response.ok) {
      let errorData: ApiError["response"] | null = null;

      try {
        errorData = isJson ? await response.json() : null;
      } catch (e) {
        // Failed to parse error response
        // console.log(`Request to ${url} failed: ${response.status} ${response.statusText}`);
        errorData = {
          message: `Request to ${url} failed: ${response.status} ${response.statusText}`,
          code: 1,
          errors: null,
          payload: null,
          totalCount: 0,
        };
      }

      if (response.status === 401) {
        // Clear guest token cache on 401
        tokenManager.clearGuestToken();
        throw new Error("Authentication failed");
      }

      throw new ApiError(
        errorData || {
          payload: null,
          message: `API request failed: ${response.status} ${response.statusText}`,
          totalCount: 0,
          code: response.status,
          errors: null,
        },
        response.status,
      );
    }

    // Handle empty responses
    if (isJson) {
      return await response.json();
    }

    return (await response.text()) as unknown as T;
  } catch (error) {
    console.error(`Request to ${url} failed`, error);
    throw error;
  }
}
