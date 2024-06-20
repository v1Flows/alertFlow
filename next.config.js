/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    API_ENDPOINT: process.env.API_ENDPOINT,
  },
}

module.exports = nextConfig
