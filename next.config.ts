// path: next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Désactiver temporairement Turbopack pour éviter les conflits
  eslint: {
    // Attention: Cela empêchera votre build de planter en cas d'erreurs ESLint.
    ignoreDuringBuilds: true,
  },
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