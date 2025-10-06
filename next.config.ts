/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    domains: ["example.com"], // antigo
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
      },
      // outros domínios
    ],
  },
   typescript: {
    ignoreBuildErrors: false, // Mantenha false para ver erros
  },
  eslint: {
    ignoreDuringBuilds: false, // Mantenha false para ver erros
  },
};

module.exports = nextConfig;
