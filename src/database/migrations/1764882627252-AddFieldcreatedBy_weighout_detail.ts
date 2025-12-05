import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFieldcreatedByWeighoutDetail1764882627252 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // add feild created_by on related key users.id(FK)
    await queryRunner.query(`
      ALTER TABLE weigh_out
      ADD COLUMN created_by INT NULL,
      ADD CONSTRAINT fk_weigh_out_created_by FOREIGN KEY (created_by) REFERENCES users(id)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE weigh_out
      DROP FOREIGN KEY fk_weigh_out_created_by,
      DROP COLUMN created_by
    `);
  }
}
