/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  trailingSlash: true,
  // eslint: {
  //   ignoreDuringBuilds: true,
  // },
  env: {
    API_ENDPOINT: process.env.API_ENDPOINT,
  },
}

const withPWA = require('next-pwa')({
  dest: 'public'
})

module.exports = withPWA({
  ...nextConfig
})
