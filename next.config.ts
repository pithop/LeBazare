// path: next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Désactiver temporairement Turbopack pour éviter les conflits
  experimental: {
    turbo: {}, // Désactiver Turbopack avec un objet vide
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'googleusercontent.com',
      },
    ],
  },
};

export default nextConfig;