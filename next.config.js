/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: {
      cssProp: true,
      transpileTemplateLiterals: true,
    },
  },
}

module.exports = nextConfig
