/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        'react-native-sqlite-storage': false,
        bcrypt: false,
      }
    }
    
    if (!isServer) {
      config.externals = config.externals || []
      config.externals.push({
        'react-native-sqlite-storage': 'react-native-sqlite-storage',
        'pg-native': 'pg-native',
        bcrypt: 'bcrypt',
        mysql: 'mysql',
        mysql2: 'mysql2',
        '@sap/hana-client': '@sap/hana-client',
        'better-sqlite3': 'better-sqlite3',
        sqlite3: 'sqlite3',
        'mssql': 'mssql',
        'oracle': 'oracle',
        'oracledb': 'oracledb',
      })
    }
    
    // Exclude all backend code from client bundle
    if (!isServer) {
      config.module = config.module || {}
      config.module.rules = config.module.rules || []
      config.module.rules.push({
        test: /src[\\\/](entities|database|repositories|services)[\\\/].*/,
        use: 'ignore-loader',
      })
    }
    
    // Suppress TypeORM warnings
    config.ignoreWarnings = [
      /Critical dependency: the request of a dependency is an expression/,
      /Module not found.*@sap\/hana-client/,
    ]
    
    return config
  },
};

export default nextConfig;
