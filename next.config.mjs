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
        source: '/((?!_next/static|_next/image|models|images|favicon.ico).*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
          {
            key: 'Netlify-CDN-Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
          {
            key: 'CDN-Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: data:; object-src 'none';",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
