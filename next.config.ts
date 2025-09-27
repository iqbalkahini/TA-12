import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuration untuk development dan production
  images: {
    domains: ['localhost'],
    // Untuk Next.js 15+ gunakan remotePatterns
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
      },
    ],
  },
  
  // TypeScript config
  typescript: {
    // Dangerously allow production builds to successfully complete even if
    // your project has TypeScript errors (optional)
    ignoreBuildErrors: false,
  },
  
  // ESLint config
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors (optional)
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
