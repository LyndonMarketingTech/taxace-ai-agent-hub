import type { NextAuthConfig } from "next-auth";

// Edge/proxy-safe config: no database or bcrypt imports here.
export default {
  providers: [],
  pages: { signIn: "/login", error: "/login" },
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 },
  callbacks: {
    authorized({ auth }) {
      return !!auth?.user;
    },
  },
} satisfies NextAuthConfig;