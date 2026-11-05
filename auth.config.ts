import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

function list(v?: string) {
  return (v ?? "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
}

export function isAllowedEmail(email?: string | null) {
  if (!email) return false;
  const e = email.toLowerCase();
  const domains = list(process.env.ALLOWED_EMAIL_DOMAINS);
  const emails = list(process.env.ALLOWED_EMAILS);
  if (emails.includes(e)) return true;
  const domain = e.split("@")[1];
  return !!domain && domains.includes(domain);
}

// Edge/proxy-safe config (no database adapter here).
export default {
  providers: [Google],
  pages: { signIn: "/login", error: "/login" },
  session: { strategy: "jwt", maxAge: 60 * 60 * 12 },
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider !== "google") return false;
      const p = profile as { email?: string; email_verified?: boolean } | undefined;
      return p?.email_verified === true && isAllowedEmail(p.email);
    },
    authorized({ auth }) {
      return !!auth?.user;
    },
  },
} satisfies NextAuthConfig;