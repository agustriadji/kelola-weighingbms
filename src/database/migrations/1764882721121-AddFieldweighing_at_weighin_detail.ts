import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFieldweighingAtWeighinDetail1764882721121 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE weigh_in
        ADD COLUMN weighing_at TIMESTAMP NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE weigh_in
        DROP COLUMN weighing_at
        `);
  }
}
