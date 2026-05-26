const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/stockscreen',
        destination: 'https://siskostock.netlify.app/stockscreen',
      },
      {
        source: '/stockscreen/:path*',
        destination: 'https://siskostock.netlify.app/stockscreen/:path*',
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "script-src 'self' 'unsafe-eval'; object-src 'none';",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
