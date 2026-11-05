import { signIn } from "@/auth";

export const metadata = { title: "Sign in | TaxAce AI Agent Hub" };

const messages: Record<string, string> = {
  AccessDenied: "That Google account isn't allowed. Please sign in with your TaxAce email.",
  Configuration: "Sign-in isn't configured correctly. Please contact the admin.",
};

export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; callbackUrl?: string }>;
}) {
  const { error, callbackUrl } = await searchParams;
  return (
    <main className="login-wrap">
      <div className="login-card">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/taxace-logo.png" alt="TaxAce" width={200} height={61} />
        <h1>AI Agent Hub</h1>
        <p>Internal access for the TaxAce team. Sign in with your TaxAce Google account.</p>
        {error && <p role="alert" className="login-error">{messages[error] ?? "Sign-in failed. Please try again."}</p>}
        <form
          action={async () => {
            "use server";
            const dest = callbackUrl && callbackUrl.startsWith("/") && !callbackUrl.startsWith("//") ? callbackUrl : "/";
            await signIn("google", { redirectTo: dest });
          }}
        >
          <button type="submit">Sign in with Google</button>
        </form>
      </div>
    </main>
  );
}