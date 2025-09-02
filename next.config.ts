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
      // Trusted CDNs and image services (add only as needed)
      // Example:
      // {
      //   protocol: 'https',
      //   hostname: 'images.unsplash.com',
      //   pathname: '/**',
      // },
    ],
    // Remove deprecated 'domains' config
    dangerouslyAllowSVG: false, // Disabled for security
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
