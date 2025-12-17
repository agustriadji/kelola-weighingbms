import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFullnameToRoles1765200000003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add fullname column to roles table
    await queryRunner.query(`
      ALTER TABLE roles 
      ADD COLUMN fullname VARCHAR(200) NULL;
    `);

    // Update existing roles with fullname based on name
    const roleUpdates = [
      { name: 'Admin', fullname: 'admin' },
      { name: 'Supervisor', fullname: 'supervisor' },
      { name: 'Operator_Registering', fullname: 'operator_registering' },
      { name: 'Operator_WeighingIn', fullname: 'operator_weighing_in' },
      { name: 'Operator_WeighingOut', fullname: 'operator_weighing_out' },
      { name: 'Viewer', fullname: 'viewer' }
    ];

    for (const role of roleUpdates) {
      await queryRunner.query(`
        UPDATE roles 
        SET fullname = '${role.fullname}' 
        WHERE name = '${role.name}';
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE roles 
      DROP COLUMN IF EXISTS fullname;
    `);
  }
}