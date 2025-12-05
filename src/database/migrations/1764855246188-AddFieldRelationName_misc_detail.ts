import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFieldRelationNameMiscDetail1764855246188 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE misc_detail ADD COLUMN relation_name VARCHAR(100) NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE misc_detail DROP COLUMN relation_name`);
  }
}
