/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'bing.ee123.net',
        port: '',
        pathname: '/img/**',
      }
    ],
  },
};

export default nextConfig;
