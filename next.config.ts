import type { NextConfig } from "next";

const config: NextConfig = {
  // Make sure the protected content + images are bundled into the serverless functions on Vercel.
  outputFileTracingIncludes: {
    "/": ["./content/**/*"],
    "/img/[name]": ["./content/img/**/*"],
  },
  poweredByHeader: false,
};

export default config;