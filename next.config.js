const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  trailingSlash: false,
  env: {
    API_ENDPOINT: process.env.API_ENDPOINT,
  },
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'alertflow.org'],
  }
}

module.exports = withPWA(nextConfig)
