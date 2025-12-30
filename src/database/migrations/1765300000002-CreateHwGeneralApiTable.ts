import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateHwGeneralApiTable1765300000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE hw_general_api (
        id SERIAL PRIMARY KEY,
        url VARCHAR(255) NOT NULL,
        created_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE hw_general_api;`);
  }
}