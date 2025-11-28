import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Target modern browsers - skip legacy polyfills
  // SWC compiler settings for modern JS
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: '*.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: 'wikipedia.org',
      },
      {
        protocol: 'https',
        hostname: '*.wikipedia.org',
      },
      {
        protocol: 'https',
        hostname: 'cwiznhnowqjvziaghjaa.supabase.co',
      },
    ],
    // Optimize image loading
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    formats: ['image/avif', 'image/webp'],
    // Cache optimized images for 1 year (31536000 seconds)
    minimumCacheTTL: 31536000,
  },
  // Enable compression
  compress: true,
  // Optimize production builds
  productionBrowserSourceMaps: false,
  // Experimental optimizations
  experimental: {
    optimizeCss: true,
    inlineCss: true, // Inline critical CSS to reduce render-blocking
  },
};

export default nextConfig;
