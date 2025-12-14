import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFieldDriverIdOutgoingDetail1765115977410 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE outgoing_detail
        ADD COLUMN driver_id text NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE weigh_out
        DROP COLUMN driver_id
        `);
  }
}
