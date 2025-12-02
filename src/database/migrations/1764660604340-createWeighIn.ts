import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateWeighIn1764660604340 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TYPE weight_type_enum AS ENUM ('BRUTTO', 'TARRA');
        `);
    await queryRunner.query(`
        CREATE TABLE weigh_in (
          id SERIAL PRIMARY KEY,
          inbound_id INT REFERENCES inbound_ticket(id),
          weight FLOAT NULL,
          weight_type weight_type_enum NOT NULL,
          timestamp TIMESTAMP DEFAULT now(),
          cctv_url TEXT NULL,
          stable BOOLEAN DEFAULT false,
          approved BOOLEAN DEFAULT false
        );

        `);
    await queryRunner.query(`
        CREATE TABLE weigh_out (
          id SERIAL PRIMARY KEY,
          inbound_id INT REFERENCES inbound_ticket(id),
          weight FLOAT NULL,
          weight_type weight_type_enum NOT NULL,
          timestamp TIMESTAMP DEFAULT now(),
          netto FLOAT NULL,
          expected_netto FLOAT NULL,
          shrinkage_value FLOAT NULL,
          shrinkage_percent FLOAT NULL,
          warning_flag BOOLEAN DEFAULT false,
          cctv_url TEXT NULL,
          status TEXT DEFAULT 'closing',
          closed_at TIMESTAMP NULL
        );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS weigh_out;`);
    await queryRunner.query(`DROP TABLE IF EXISTS weigh_in;`);
    await queryRunner.query(`DROP TYPE IF EXISTS weight_type_enum;`);
  }
}
