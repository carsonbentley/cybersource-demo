import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // The Cybersource SDK uses dynamic requires; load it from node_modules instead of bundling it.
  serverExternalPackages: ["cybersource-rest-client"],
};

export default nextConfig;
