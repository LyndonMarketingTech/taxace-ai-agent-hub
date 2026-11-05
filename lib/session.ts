import { auth } from "@/auth";
import { sql } from "@/lib/db";

export type CurrentUser = { id: string; name: string; email: string; role: string };

// Verifies the signed-in user still exists and is active in the database
// (so disabling an account takes effect on the next page load).
export async function getActiveUser(): Promise<CurrentUser | null> {
  const session = await auth();
  const id = session?.user?.id;
  if (!id) return null;
  const rows = (await sql()`
    SELECT id, name, email, role FROM users WHERE id = ${id} AND active = TRUE LIMIT 1`) as CurrentUser[];
  return rows[0] ?? null;
}

export async function requireAdmin(): Promise<CurrentUser> {
  const u = await getActiveUser();
  if (!u || u.role !== "admin") throw new Error("Forbidden");
  return u;
}