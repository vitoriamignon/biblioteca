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
    ignoreBuildErrors: true, // Mantenha false para ver erros
  },
  eslint: {
    ignoreDuringBuilds: true, // Mantenha false para ver erros
  },
};

module.exports = nextConfig;
