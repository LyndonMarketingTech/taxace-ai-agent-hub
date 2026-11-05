import type { NextConfig } from "next";

const allowedOrigins = ["localhost:3000", "*.app.github.dev"];
if (process.env.CODESPACE_NAME) {
  const domain = process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN ?? "app.github.dev";
  allowedOrigins.push(`${process.env.CODESPACE_NAME}-3000.${domain}`);
}

const config: NextConfig = {
  outputFileTracingIncludes: {
    "/": ["./content/**/*"],
    "/img/[name]": ["./content/img/**/*"],
  },
  poweredByHeader: false,
  experimental: {
    serverActions: { allowedOrigins },
  },
};

export default config;