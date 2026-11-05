import Link from "next/link";
import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import { allowedDomains } from "@/lib/email";
import { getActiveUser } from "@/lib/session";
import { createUser, resetPassword, setActive } from "./actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin | TaxAce AI Agent Hub" };

type U = { id: string; name: string; email: string; role: string; active: boolean; locked: boolean };

export default async function Admin({ searchParams }: { searchParams: Promise<{ msg?: string; ok?: string }> }) {
  const me = await getActiveUser();
  if (!me) redirect("/login");
  if (me.role !== "admin") redirect("/");
  const { msg, ok } = await searchParams;
  const users = (await sql()`
    SELECT id, name, email, role, active, (locked_until IS NOT NULL AND locked_until > now()) AS locked
    FROM users ORDER BY created_at`) as U[];

  return (
    <main className="page-wrap">
      <div className="panel">
        <p><Link href="/">&larr; Back to hub</Link></p>
        <h1>Manage users</h1>
        {ok && <p className="ok">{ok}</p>}
        {msg && <p role="alert" className="login-error">{msg}</p>}

        <h2>Add a user</h2>
        <form action={createUser} className="row">
          <input name="name" placeholder="Full name" required />
          <input name="email" type="email" placeholder={`name@${allowedDomains()[0]}`} required />
          <input name="password" type="text" placeholder="Temporary password (10+ chars)" minLength={10} required autoComplete="off" />
          <select name="role" defaultValue="user"><option value="user">User</option><option value="admin">Admin</option></select>
          <button type="submit">Add</button>
        </form>

        <h2>Users ({users.length})</h2>
        <div className="table-scroll">
          <table>
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Reset password</th><th></th></tr></thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>{!u.active ? "Disabled" : u.locked ? "Locked" : "Active"}</td>
                  <td>
                    <form action={resetPassword} className="row">
                      <input type="hidden" name="id" value={u.id} />
                      <input name="password" type="text" placeholder="New password" minLength={10} required autoComplete="off" />
                      <button type="submit">Reset</button>
                    </form>
                  </td>
                  <td>
                    {u.id !== me.id && (
                      <form action={setActive}>
                        <input type="hidden" name="id" value={u.id} />
                        <input type="hidden" name="active" value={String(!u.active)} />
                        <button type="submit" className="ghost">{u.active ? "Disable" : "Enable"}</button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}