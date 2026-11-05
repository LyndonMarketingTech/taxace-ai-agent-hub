import Link from "next/link";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { sql } from "@/lib/db";
import { validatePassword } from "@/lib/email";
import { getActiveUser } from "@/lib/session";

export const dynamic = "force-dynamic";
export const metadata = { title: "Account | TaxAce AI Agent Hub" };

export default async function Account({ searchParams }: { searchParams: Promise<{ msg?: string; ok?: string }> }) {
  const user = await getActiveUser();
  if (!user) redirect("/login");
  const { msg, ok } = await searchParams;

  async function change(formData: FormData) {
    "use server";
    const me = await getActiveUser();
    if (!me) redirect("/login");
    const current = String(formData.get("current") ?? "");
    const next = String(formData.get("next") ?? "");
    const confirm = String(formData.get("confirm") ?? "");
    const fail = (m: string) => redirect(`/account?msg=${encodeURIComponent(m)}`);
    const rows = (await sql()`SELECT password_hash FROM users WHERE id = ${me.id}`) as { password_hash: string }[];
    if (!rows[0] || !(await bcrypt.compare(current, rows[0].password_hash))) fail("Current password is incorrect.");
    const bad = validatePassword(next);
    if (bad) fail(bad);
    if (next !== confirm) fail("New passwords do not match.");
    const hash = await bcrypt.hash(next, 12);
    await sql()`UPDATE users SET password_hash = ${hash} WHERE id = ${me.id}`;
    redirect("/account?ok=1");
  }

  return (
    <main className="page-wrap">
      <div className="panel narrow">
        <p><Link href="/">&larr; Back to hub</Link></p>
        <h1>Account</h1>
        <p className="muted">{user.name} &middot; {user.email}</p>
        <h2>Change password</h2>
        {ok && <p className="ok">Password updated.</p>}
        {msg && <p role="alert" className="login-error">{msg}</p>}
        <form action={change} className="stack">
          <label>Current password<input name="current" type="password" autoComplete="current-password" required /></label>
          <label>New password (10+ characters)<input name="next" type="password" autoComplete="new-password" required minLength={10} /></label>
          <label>Confirm new password<input name="confirm" type="password" autoComplete="new-password" required minLength={10} /></label>
          <button type="submit">Update password</button>
        </form>
      </div>
    </main>
  );
}