import type { TokenResponse } from "@/types/common";

interface CachedToken {
  token: string;
  expires: number;
  tokenType: string;
  scope: string;
}

class TokenManager {
  private guestTokenCache: CachedToken | null = null;

  isTokenExpired(cachedToken: CachedToken | null): boolean {
    if (!cachedToken) return true;
    return Date.now() >= cachedToken.expires;
  }

  getCachedGuestToken(): string | null {
    if (this.isTokenExpired(this.guestTokenCache)) {
      this.clearGuestToken();
      return null;
    }
    return this.guestTokenCache?.token || null;
  }

  cacheGuestToken(tokenResponse: TokenResponse): void {
    // Subtract 5 minutes (300 seconds) from expires_in for safety buffer
    const safetyBufferSeconds = 300;
    const expiresInMs = (tokenResponse.expires_in - safetyBufferSeconds) * 1000;

    this.guestTokenCache = {
      token: tokenResponse.access_token,
      expires: Date.now() + expiresInMs,
      tokenType: tokenResponse.token_type,
      scope: tokenResponse.scope,
    };

    console.log(
      `Guest token cached for ${Math.floor((tokenResponse.expires_in - safetyBufferSeconds) / 60)} minutes`,
    );
  }

  clearGuestToken(): void {
    this.guestTokenCache = null;
  }

  getTokenInfo(): {
    hasToken: boolean;
    expiresIn?: number;
    tokenType?: string;
    scope?: string;
  } {
    if (!this.guestTokenCache || this.isTokenExpired(this.guestTokenCache)) {
      return { hasToken: false };
    }

    const expiresIn = Math.floor((this.guestTokenCache.expires - Date.now()) / 1000);

    return {
      hasToken: true,
      expiresIn,
      tokenType: this.guestTokenCache.tokenType,
      scope: this.guestTokenCache.scope,
    };
  }
}

export const tokenManager = new TokenManager();
