"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import { allowedDomains, isAllowedEmail, normalizeEmail, validatePassword } from "@/lib/email";
import { requireAdmin } from "@/lib/session";

const back = (m: string, ok = false) => redirect(`/admin?${ok ? "ok" : "msg"}=${encodeURIComponent(m)}`);

export async function createUser(formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const email = normalizeEmail(String(formData.get("email") ?? ""));
  const password = String(formData.get("password") ?? "");
  const role = formData.get("role") === "admin" ? "admin" : "user";
  if (!name) back("Name is required.");
  if (!isAllowedEmail(email)) back(`Email must be on: ${allowedDomains().join(", ")}`);
  const bad = validatePassword(password);
  if (bad) back(bad);
  const hash = await bcrypt.hash(password, 12);
  const rows = await sql()`
    INSERT INTO users (name, email, password_hash, role) VALUES (${name}, ${email}, ${hash}, ${role})
    ON CONFLICT DO NOTHING RETURNING id`;
  if (rows.length === 0) back("A user with that email already exists.");
  back(`Created ${email}. Share the temporary password with them privately.`, true);
}

export async function resetPassword(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const password = String(formData.get("password") ?? "");
  const bad = validatePassword(password);
  if (bad) back(bad);
  const hash = await bcrypt.hash(password, 12);
  await sql()`UPDATE users SET password_hash = ${hash}, failed_attempts = 0, locked_until = NULL WHERE id = ${id}`;
  back("Password reset (and any lockout cleared).", true);
}

export async function setActive(formData: FormData) {
  const me = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const active = formData.get("active") === "true";
  if (id === me.id) back("You can't disable your own account.");
  await sql()`UPDATE users SET active = ${active} WHERE id = ${id}`;
  back(active ? "User enabled." : "User disabled.", true);
}