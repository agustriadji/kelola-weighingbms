import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeEnumType1765115977409 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // delete already transaction_type_enum
    const existsIn = await queryRunner.query(`
        SELECT 1
        FROM pg_enum
        WHERE enumtypid = 'transaction_type_enum'::regtype
            AND enumlabel = 'INCOMING'
        `);

    const existsOut = await queryRunner.query(`
            SELECT 1
            FROM pg_enum
            WHERE enumtypid = 'transaction_type_enum'::regtype
                AND enumlabel = 'OUTGOING'
            `);

    const existsMisc = await queryRunner.query(`
            SELECT 1
            FROM pg_enum
            WHERE enumtypid = 'transaction_type_enum'::regtype
                AND enumlabel = 'MISC'
            `);

    if (existsIn.length) {
      await queryRunner.query(`
          ALTER TYPE transaction_type_enum RENAME VALUE 'INCOMING' TO 'RAW_MATERIAL';
      `);
    }

    if (existsOut.length) {
      await queryRunner.query(`
          ALTER TYPE transaction_type_enum RENAME VALUE 'OUTGOING' TO 'DISPATCH';
      `);
    }

    if (existsMisc.length) {
      await queryRunner.query(`
          ALTER TYPE transaction_type_enum RENAME VALUE 'MISC' TO 'MISCELLANEOUS';
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TYPE IF EXISTS transaction_type_enum;`);
  }
}
