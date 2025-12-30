import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateHwConfigurationTable1765300000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE hw_area_enum AS ENUM ('REGISTERING', 'WEIGHING-IN', 'WEIGHING-OUT');
    `);

    await queryRunner.query(`
      CREATE TABLE hw_configuration (
        id SERIAL PRIMARY KEY,
        area hw_area_enum,
        data_config JSONB DEFAULT NULL,
        created_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        is_deleted BOOLEAN DEFAULT false
      );
    `);

    await queryRunner.query(`
      CREATE INDEX idx_hw_configuration_area ON hw_configuration(area);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE hw_configuration;`);
    await queryRunner.query(`DROP TYPE hw_area_enum;`);
  }
}