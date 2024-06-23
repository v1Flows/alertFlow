/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    API_ENDPOINT: process.env.API_ENDPOINT,
  },
}

module.exports = nextConfig
