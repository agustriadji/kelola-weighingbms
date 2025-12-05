import { MigrationInterface, QueryRunner } from 'typeorm';

export class EnumType1764659384899 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    /**
         * CREATE TYPE transaction_type_enum AS ENUM ('INCOMING', 'OUTGOING', 'MISC');
            CREATE TYPE inbound_status_enum AS ENUM (
            'registered',
            'queue-weigh-in',
            'weighing-in',
            'weighed-in',
            'yard-processing',
            'queue-weigh-out',
            'weighing-out',
            'weighed-out',
            'finished'
            );
         */
    await queryRunner.query(`
          CREATE TYPE transaction_type_enum AS ENUM ('INCOMING', 'OUTGOING', 'MISC');
        `);

    await queryRunner.query(`
          CREATE TYPE inbound_status_enum AS ENUM (
            'registered',
            'queue-weigh-in',
            'weighing-in',
            'weighed-in',
            'yard-processing',
            'queue-weigh-out',
            'weighing-out',
            'weighed-out',
            'finished'
          );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TYPE IF EXISTS transaction_type_enum;`);
    await queryRunner.query(`DROP TYPE IF EXISTS inbound_status_enum;`);
  }
}
