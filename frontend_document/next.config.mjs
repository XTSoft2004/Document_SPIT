/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['localhost', 'document.spit-husc.io.vn', 'xtcoder2004.io.vn', 'xtcoder2004.io.vn:1122', 'backend', '192.168.1.20'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'drive.google.com',
        pathname: '/thumbnails/**',
      },
      {
        protocol: 'http',
        hostname: 'xtcoder2004.io.vn',
        pathname: '/document/thumbnail/**',
      },
      {
        protocol: 'http',
        hostname: 'xtcoder2004.io.vn:1122',
        pathname: '/document/download/**',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb',
    },
  },
}

export default nextConfig
