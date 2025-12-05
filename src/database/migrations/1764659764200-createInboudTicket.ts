import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInboudTicket1764659764200 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    /**
         * CREATE TABLE inbound_ticket (
            id SERIAL PRIMARY KEY,
            transaction_type transaction_type_enum NOT NULL,
            transaction_id INT NOT NULL,
            status inbound_status_enum NOT NULL DEFAULT 'registered',
            weigh_in_id INT NULL,
            weigh_out_id INT NULL,
            created_at TIMESTAMP DEFAULT now(),
            updated_at TIMESTAMP DEFAULT now()
            );

         */
    await queryRunner.query(`
            CREATE TABLE inbound_ticket (
                id SERIAL PRIMARY KEY,
                transaction_type transaction_type_enum NOT NULL,
                transaction_id INT NOT NULL,
                status inbound_status_enum NOT NULL DEFAULT 'registered',
                weigh_in_id INT NULL,
                weigh_out_id INT NULL,
                created_at TIMESTAMP DEFAULT now(),
                updated_at TIMESTAMP DEFAULT now()
            );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS inbound_ticket;`);
  }
}
