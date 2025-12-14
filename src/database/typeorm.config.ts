const dotenv = require('dotenv');
require('reflect-metadata');
const { DataSource } = require('typeorm');

dotenv.config({ path: '.env.local' });
dotenv.config();

module.exports = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: false,
  entities: ['dist/entities/*.js'],
  migrations: ['dist/database/migrations/*.js'],
  cache: {
    type: 'database',
    tableName: 'query_result_cache',
    duration: 30000, // 30 seconds
  },
});
