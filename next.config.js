/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Повністю вимикаємо ESLint під час збірки
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/locales/:path*',
        destination: '/public/locales/:path*',
      },
    ];
  },
  publicRuntimeConfig: {
    locales: ['uk', 'en', 'ru'],
    defaultLocale: 'uk',
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.json$/,
      type: 'json',
      resolve: {
        fullySpecified: false,
      },
    });
    return config;
  },
  async headers() {
    return [
      {
        source: '/locales/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig
