// path: next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // On déplace la configuration Turbopack ici, au premier niveau
  turbopack: {
    // On indique explicitement que la racine du projet est le dossier actuel
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/lebazare-placeholder/**',
      },
      {
        protocol: 'https',
        hostname: 'googleusercontent.com',
      },
    ],
  },
};

export default nextConfig;