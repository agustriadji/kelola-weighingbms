/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/images/:path*', // semua file di /public/images
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // ✅ Fix TypeORM bundle bloat
  webpack: (config, { isServer }) => {
    // Apply to both server and client
    config.resolve.fallback = {
      ...config.resolve.fallback,
      'react-native-sqlite-storage': false,
      '@sap/hana-client': false,
      mysql: false,
      mysql2: false,
      oracledb: false,
      'pg-native': false,
      sqlite3: false,
    };

    // Ignore TypeORM warnings
    config.ignoreWarnings = [
      { module: /node_modules\/typeorm/ },
      /Critical dependency: the request of a dependency is an expression/,
      /Module not found: Can't resolve/,
    ];

    return config;
  },
};

module.exports = nextConfig;
