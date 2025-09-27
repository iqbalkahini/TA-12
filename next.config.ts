import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuration untuk development dan production
  images: {
    domains: ['localhost'],
  },
  
  // Experimental features untuk handling HTTP API
  experimental: {
    // Allowlist insecure HTTP origins untuk development
    allowedRevalidateHeaderKeys: ['authorization'],
  },
};

export default nextConfig;
