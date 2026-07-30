import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A package-lock exists in the home directory too; pin Turbopack to this app.
  // This prevents it from trying to watch the entire home directory in development.
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
