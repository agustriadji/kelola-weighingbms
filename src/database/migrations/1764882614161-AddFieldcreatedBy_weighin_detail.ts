import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFieldcreatedByWeighinDetail1764882614161 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // add feild created_by on related key users.id(FK)
    await queryRunner.query(`
      ALTER TABLE weigh_in
      ADD COLUMN created_by INT NULL,
      ADD CONSTRAINT fk_weigh_in_created_by FOREIGN KEY (created_by) REFERENCES users(id)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE weigh_in
      DROP FOREIGN KEY fk_weigh_in_created_by,
      DROP COLUMN created_by
    `);
  }
}
