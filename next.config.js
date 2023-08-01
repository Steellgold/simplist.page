/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    domains: ["api.producthunt.com"],
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig