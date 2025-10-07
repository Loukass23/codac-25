import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    // ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "owndjvzdolurxqxuwumh.supabase.co",
      },
    ],
  },
  // Handle server-side external packages
  serverExternalPackages: ['canvas', 'jsdom', 'sharp', 'detect-libc'],
  // Turbopack configuration (replaces webpack for better performance)
  turbopack: {
    resolveAlias: {
      // Handle jsdom version conflicts
      jsdom: require.resolve('jsdom'),
    },
    resolveExtensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  // Basic headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

export default nextConfig;