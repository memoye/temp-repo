//next-auth.js.org/getting-started/typescript#module-augmentation
Ref: https: import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    access_token?: string;
    refresh_token: string;
    expires_at: number;
    id_token?: string;
    error?: string;

    user: {
      FirmId?: string;
      Permissions?: string[];
      Tenant?: string;
      TenantId?: string;
      access_token?: string;
      auth_time?: number;
      email?: string;
      expires_at?: number;
      family_name?: string;
      given_name?: string;
      id?: string;
      phone_number?: string;
      preferred_username?: string;
      refresh_token?: string;
      role?: "SuperAdmin" | "Admin" | "Regular" | "User" | string;
    } & DefaultSession["user"];
  }
  interface User extends DefaultUser {
    username: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    username: string;
  }
}

// declare module "next-auth" {

// }
