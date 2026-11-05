export function allowedDomains() {
  return (process.env.ALLOWED_EMAIL_DOMAINS ?? "taxace.com")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function isAllowedEmail(email: string) {
  const m = /^[^\s@]+@([^\s@]+\.[^\s@]+)$/.exec(email);
  return !!m && allowedDomains().includes(m[1]);
}

export function validatePassword(pw: string): string | null {
  if (pw.length < 10) return "Password must be at least 10 characters.";
  if (pw.length > 128) return "Password is too long.";
  return null;
}