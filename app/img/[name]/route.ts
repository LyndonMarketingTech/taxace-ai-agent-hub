import { readFile } from "node:fs/promises";
import path from "node:path";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

const TYPES: Record<string, string> = { png: "image/png", webp: "image/webp" };

export async function GET(_req: Request, ctx: { params: Promise<{ name: string }> }) {
  const session = await auth();
  if (!session?.user) return new Response("Unauthorized", { status: 401 });
  const { name } = await ctx.params;
  const m = /^([a-f0-9]{10})\.(png|webp)$/.exec(name);
  if (!m) return new Response("Not found", { status: 404 });
  try {
    const buf = await readFile(path.join(process.cwd(), "content", "img", name));
    return new Response(new Uint8Array(buf), {
      headers: { "Content-Type": TYPES[m[2]], "Cache-Control": "private, max-age=3600" },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}