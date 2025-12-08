/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  webpack: (config, { isServer, dev }) => {
    // Hot reload for Docker
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: /node_modules/,
      };
    }

    // Server-side optimizationsss
    if (isServer) {
      // Only load PostgreSQL driver on server
      config.externals = config.externals || [];
      config.externals.push({
        'react-native-sqlite-storage': 'commonjs react-native-sqlite-storage',
        mysql: 'commonjs mysql',
        mysql2: 'commonjs mysql2',
        '@sap/hana-client': 'commonjs @sap/hana-client',
        'better-sqlite3': 'commonjs better-sqlite3',
        sqlite3: 'commonjs sqlite3',
        mssql: 'commonjs mssql',
        oracle: 'commonjs oracle',
        oracledb: 'commonjs oracledb',
      });
    }

    // Client-side optimizations
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        'react-native-sqlite-storage': false,
        bcrypt: false,
        mysql: false,
        mysql2: false,
        pg: false,
        'pg-native': false,
      };

      // Exclude backend modules from client bundle only
      config.resolve.fallback = {
        ...config.resolve.fallback,
        typeorm: false,
      };
    }

    // Global optimizations
    config.resolve.alias = {
      ...config.resolve.alias,
      'react-native-sqlite-storage': false,
      mysql: false,
      mysql2: false,
      '@sap/hana-client': false,
      'better-sqlite3': false,
      sqlite3: false,
      mssql: false,
      oracle: false,
      oracledb: false,
    };

    // Suppress all TypeORM warnings
    config.ignoreWarnings = [
      /Critical dependency: the request of a dependency is an expression/,
      /Module not found.*react-native-sqlite-storage/,
      /Module not found.*mysql/,
      /Module not found.*@sap\/hana-client/,
      /Module not found.*better-sqlite3/,
      /Module not found.*sqlite3/,
      /Module not found.*mssql/,
      /Module not found.*oracle/,
      /Can't resolve.*in.*typeorm.*driver/,
    ];

    return config;
  },
};

export default nextConfig;
