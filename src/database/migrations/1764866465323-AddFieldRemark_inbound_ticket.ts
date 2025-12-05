import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFieldRemarkInboundTicket1764866465323 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE inbound_ticket
      ADD COLUMN remark VARCHAR(200)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE inbound_ticket
      DROP COLUMN remark
    `);
  }
}
