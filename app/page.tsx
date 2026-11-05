import { readFile } from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import Script from "next/script";
import { redirect } from "next/navigation";
import { signOut } from "@/auth";
import { getActiveUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function Home() {
  const user = await getActiveUser(); // proxy blocks anonymous users; this also rejects disabled ones
  if (!user) redirect("/login");
  const html = await readFile(path.join(process.cwd(), "content", "hub.html"), "utf8");
  return (
    <>
      <div className="user-bar">
        <span>{user.name}</span>
        <Link href="/account">Account</Link>
        {user.role === "admin" && <Link href="/admin">Admin</Link>}
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
        >
          <button type="submit">Sign out</button>
        </form>
      </div>
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <Script src="/hub.js" strategy="afterInteractive" />
    </>
  );
}