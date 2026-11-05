// Usage: node scripts/create-user.mjs "Full Name" name@taxace.com "TempPassword123" [--admin]
// Creates a user (use --admin for the first admin). Reads DATABASE_URL from the environment.
import bcrypt from "bcryptjs";
import { neon } from "@neondatabase/serverless";

const args = process.argv.slice(2);
const admin = args.includes("--admin");
const [name, rawEmail, password] = args.filter((a) => a !== "--admin");
const url = process.env.DATABASE_URL;
const domains = (process.env.ALLOWED_EMAIL_DOMAINS ?? "taxace.com").split(",").map((s) => s.trim().toLowerCase());

if (!url || !name || !rawEmail || !password) {
  console.error('Usage: DATABASE_URL=... node scripts/create-user.mjs "Full Name" email "password" [--admin]');
  process.exit(1);
}
const email = rawEmail.trim().toLowerCase();
if (!domains.includes(email.split("@")[1])) { console.error(`Email must be on: ${domains.join(", ")}`); process.exit(1); }
if (password.length < 10) { console.error("Password must be at least 10 characters."); process.exit(1); }

const sql = neon(url);
const hash = await bcrypt.hash(password, 12);
const rows = await sql`
  INSERT INTO users (name, email, password_hash, role) VALUES (${name}, ${email}, ${hash}, ${admin ? "admin" : "user"})
  ON CONFLICT DO NOTHING RETURNING id`;
console.log(rows.length ? `Created ${admin ? "admin" : "user"} ${email}` : `A user with ${email} already exists.`);