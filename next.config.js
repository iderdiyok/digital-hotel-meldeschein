/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration for Digital Hotel Meldeschein
  // Server Actions sind in Next.js 14 standardmäßig aktiviert

  // Optimierungen für Bilder
  images: {
    domains: ['localhost'],
  },
};

module.exports = nextConfig;
