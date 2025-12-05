import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFieldcreatedByInboundTicket1764882596221 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // add feild created_by on related key users.id(FK)
    await queryRunner.query(`
      ALTER TABLE inbound_ticket
      ADD COLUMN created_by INT NULL,
      ADD CONSTRAINT fk_inbound_ticket_created_by FOREIGN KEY (created_by) REFERENCES users(id)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE inbound_ticket
      DROP FOREIGN KEY fk_inbound_ticket_created_by,
      DROP COLUMN created_by
    `);
  }
}
