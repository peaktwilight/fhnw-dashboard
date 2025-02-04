/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['www.fhnw.ch'],
  },
  async rewrites() {
    return [
      {
        source: '/api/news',
        destination: 'https://www.fhnw.ch/de/api/news/search',
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-Requested-With, Content-Type, Authorization' },
        ],
      },
    ];
  },
  env: {
    NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA: process.env.VERCEL_GIT_COMMIT_SHA,
    NEXT_PUBLIC_VERCEL_GIT_COMMIT_MESSAGE: process.env.VERCEL_GIT_COMMIT_MESSAGE,
    NEXT_PUBLIC_VERCEL_ENV: process.env.VERCEL_ENV
  }
};

module.exports = nextConfig; 