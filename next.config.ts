import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Local development
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
      // Production domain
      {
        protocol: 'https',
        hostname: 'www.barneveldsdagblad.nl',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'barneveldsdagblad.nl',
        pathname: '/**',
      },
      // Vercel Blob Storage
      {
        protocol: 'https',
        hostname: '*.blob.vercel-storage.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
        pathname: '/**',
      },
      // Wikipedia and Wikimedia Commons
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.wikimedia.org',
        pathname: '/**',
      },
      // Common news and stock photo sources
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.pexels.com',
        pathname: '/**',
      },
      // ANP/Dutch news sources
      {
        protocol: 'https',
        hostname: '*.anp.nl',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.nos.nl',
        pathname: '/**',
      },
    ],
    // Remove deprecated 'domains' config
    dangerouslyAllowSVG: false, // Disabled for security
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
