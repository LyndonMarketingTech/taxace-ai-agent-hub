import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { signIn } from "@/auth";

export const metadata = { title: "Sign in | TaxAce AI Agent Hub" };

function safeDest(v?: string) {
  return v && v.startsWith("/") && !v.startsWith("//") ? v : "/";
}

export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; callbackUrl?: string }>;
}) {
  const { error, callbackUrl } = await searchParams;
  const dest = safeDest(callbackUrl);

  async function login(formData: FormData) {
    "use server";
    try {
      await signIn("credentials", {
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? ""),
        redirectTo: dest,
      });
    } catch (e) {
      if (e instanceof AuthError) {
        redirect(`/login?error=1&callbackUrl=${encodeURIComponent(dest)}`);
      }
      throw e; // lets the success redirect through
    }
  }

  return (
    <main className="login-wrap">
      <div className="login-card">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/taxace-logo.png" alt="TaxAce" width={200} height={61} />
        <h1>AI Agent Hub</h1>
        <p>Internal access for the TaxAce team. Sign in with your TaxAce email and password.</p>
        {error && (
          <p role="alert" className="login-error">
            Incorrect email or password, or the account is disabled or temporarily locked.
          </p>
        )}
        <form action={login} className="stack">
          <label>
            Email
            <input name="email" type="email" autoComplete="username" required />
          </label>
          <label>
            Password
            <input name="password" type="password" autoComplete="current-password" required />
          </label>
          <button type="submit">Sign in</button>
        </form>
        <p className="muted">No account? Ask your TaxAce admin to create one for you.</p>
      </div>
    </main>
  );
}