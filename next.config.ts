import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: '*.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: "https",
        hostname: "**"
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
   i18n: {
    locales: ["pt-BR"],      // only Portuguese
    defaultLocale: "pt-BR",  // default language
    localeDetection: false,  // disables automatic redirect
  },
};

export default nextConfig;
