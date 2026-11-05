import { readFile } from "node:fs/promises";
import path from "node:path";
import Script from "next/script";
import { auth, signOut } from "@/auth";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await auth(); // proxy already blocks anonymous users; this is defense in depth
  if (!session?.user) {
    const { redirect } = await import("next/navigation");
    redirect("/login");
  }
  const html = await readFile(path.join(process.cwd(), "content", "hub.html"), "utf8");
  return (
    <>
      <div className="user-bar">
        <span>{session!.user!.email}</span>
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