import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFieldweighingAtWeighoutDetail1764882728959 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE weigh_out
        ADD COLUMN weighing_at TIMESTAMP NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE weigh_out
        DROP COLUMN weighing_at
        `);
  }
}
