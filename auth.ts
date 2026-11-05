import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import authConfig from "./auth.config";
import { sql } from "@/lib/db";
import { normalizeEmail } from "@/lib/email";

const MAX_FAILED = 5;
const LOCK_MINUTES = 15;
let dummyHash: string | undefined;

type Row = {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: string;
  active: boolean;
  locked_until: string | null;
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        const email = normalizeEmail(String(credentials?.email ?? ""));
        const password = String(credentials?.password ?? "");
        if (!email || !password || password.length > 128) return null;

        const db = sql();
        const rows = (await db`
          SELECT id, name, email, password_hash, role, active, locked_until
          FROM users WHERE lower(email) = ${email} LIMIT 1`) as Row[];
        const u = rows[0];

        // Always run a bcrypt compare so response time doesn't reveal whether the email exists.
        dummyHash ??= bcrypt.hashSync("not-a-real-password", 10);
        const ok = await bcrypt.compare(password, u?.password_hash ?? dummyHash);

        if (!u) return null;
        if (u.locked_until && new Date(u.locked_until) > new Date()) return null;
        if (!ok || !u.active) {
          if (!ok) {
            await db`
              UPDATE users SET
                failed_attempts = failed_attempts + 1,
                locked_until = CASE WHEN failed_attempts + 1 >= ${MAX_FAILED}
                  THEN now() + make_interval(mins => ${LOCK_MINUTES}) ELSE locked_until END
              WHERE id = ${u.id}`;
          }
          return null;
        }
        await db`UPDATE users SET failed_attempts = 0, locked_until = NULL WHERE id = ${u.id}`;
        return { id: u.id, name: u.name, email: u.email, role: u.role };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    jwt({ token, user }) {
      if (user) {
        token.uid = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.uid as string;
      session.user.role = (token.role as string) ?? "user";
      return session;
    },
  },
});