import NextAuth from "next-auth";
import PostgresAdapter from "@auth/pg-adapter";
import { Pool } from "@neondatabase/serverless";
import authConfig from "./auth.config";

// Lazy config so a fresh Pool is created per request (recommended for serverless/Neon).
export const { handlers, auth, signIn, signOut } = NextAuth(() => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  return {
    ...authConfig,
    adapter: PostgresAdapter(pool),
  };
});