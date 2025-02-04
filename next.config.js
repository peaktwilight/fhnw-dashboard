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
};

module.exports = nextConfig; 