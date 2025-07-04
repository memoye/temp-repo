import NextAuth, { type DefaultSession, type NextAuthConfig } from "next-auth";
import { decodeJwtPayload } from "./lib/utils";

export const authConfig = {
  providers: [
    {
      id: "login",
      name: "Chronica",
      type: "oidc",
      issuer: process.env.AUTH_ISSUER,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      wellKnown: `${process.env.AUTH_ISSUER}/.well-known/openid-configuration`,
      checks: ["pkce", "state"],
      authorization: {
        params: {
          redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/login`,
          scope: "openid profile offline_access",
          response_type: "code",
          claims: JSON.stringify({
            id_token: {
              name: null,
              email: null,
              given_name: null,
            },
          }),
        },
      },
      client: {
        token_endpoint_auth_method: "client_secret_post",
      },
      idToken: true, // ✅ important: ensures id_token is returned
    },
  ],
  session: {
    strategy: "jwt",
    maxAge: 1 * 60 * 60,
  },
  callbacks: {
    async authorized({ auth }) {
      return !!auth;
    },

    async jwt({ token, account }) {
      const now = Math.floor(Date.now() / 1000);

      if (account) {
        return {
          ...token,
          access_token: account.access_token,
          refresh_token: account.refresh_token,
          id_token: account.id_token, // ✅ Save id_token
          expires_at: now + (account.expires_in ?? 3600),
        };
      }

      if (token.expires_at && now < (token.expires_at as number)) {
        return token;
      }

      try {
        const response = await fetch(`${process.env.AUTH_ISSUER}/connect/token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token: token.refresh_token as string,
            client_id: process.env.CLIENT_ID as string,
            client_secret: process.env.CLIENT_SECRET as string,
          }),
        });

        try {
          const text = await response.text();
          const refreshedTokens = JSON.parse(text);
          if (!response.ok) throw refreshedTokens;

          return {
            ...token,
            access_token: refreshedTokens.access_token,
            refresh_token: refreshedTokens.refresh_token ?? token.refresh_token,
            id_token: refreshedTokens.id_token ?? token.id_token,
            expires_at: now + refreshedTokens.expires_in,
          };
        } catch (err) {
          console.error("Token refresh error", err);
          console.error("Raw response:", response);
          return { ...token, error: "RefreshAccessTokenError" };
        }
      } catch (err) {
        console.error("Token refresh error", err);
        return { ...token, error: "RefreshAccessTokenError" };
      }
    },

    async session({ session, token, user }) {
      const decoded = decodeJwtPayload(token.access_token as string);

      if (decoded) {
        session.user = {
          name: `${decoded.given_name} ${decoded.family_name}`,
          email: decoded.email,
          role: decoded.role,
          Tenant: decoded.Tenant,
          TenantId: decoded.TenantId,
          Permissions: decoded.Permissions,
          FirmId: decoded.FirmId,
          id: decoded.id,
          phone_number: decoded.phone_number,
          auth_time: decoded.auth_time,
          expires_at: token.expires_at as number,
          emailVerified: decoded.email_verified,
          given_name: decoded.given_name,
          family_name: decoded.family_name,
          preferred_username: decoded.preferred_username,
          username: decoded.username,
        };
      }

      session.access_token = token.access_token as string;
      session.refresh_token = token.refresh_token as string;
      session.expires_at = token.expires_at as number;
      session.id_token = token.id_token as string; // ✅ Expose to session
      return session;
    },

    async redirect() {
      return "/dashboard";
    },
  },
} satisfies NextAuthConfig;

export async function completeLogout(idToken: string) {
  const baseUrl = `${process.env.NEXT_PUBLIC_AUTH_URL}/connect/endsession`;
  const logoutUrl = new URL(baseUrl);

  logoutUrl.searchParams.set("post_logout_redirect_uri", process.env.NEXT_PUBLIC_APP_URL!);
  logoutUrl.searchParams.set("id_token_hint", idToken);
  logoutUrl.searchParams.set("client_id", process.env.NEXT_PUBLIC_AUTH_CLIENT_ID!);

  window.location.href = logoutUrl.toString();
}

export const { handlers, signOut, signIn, auth } = NextAuth(authConfig);
