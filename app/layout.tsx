import type { Metadata, Viewport } from "next";
import "./hub.css";
import "./app.css";

export const metadata: Metadata = {
  title: "TaxAce AI Agent Hub",
  description: "Internal TaxAce guide and access point for MarGine, Newella, Vidora, and Webtrix.",
  icons: { icon: "/favicon.png" },
  robots: { index: false, follow: false },
};
export const viewport: Viewport = { themeColor: "#071210" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="no-js" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&display=swap"
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}