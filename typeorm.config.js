const { DataSource } = require('typeorm');

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'db',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'wbms_user',
  password: process.env.DB_PASSWORD || 'wbms_password',
  database: process.env.DB_NAME || 'wbms_db',
  entities: ['src/entities/*.entity.{ts,js}'],
  migrations: ['src/database/migrations/*.{ts,js}'],
  synchronize: false,
  logging: false,
});

module.exports = { AppDataSource };