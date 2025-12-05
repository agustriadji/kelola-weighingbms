import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOutgoingDetail1764660588798 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    /**
         * CREATE TABLE outgoing_detail (
            id SERIAL PRIMARY KEY,
            rfid TEXT NULL,
            vehicle_no TEXT NOT NULL,
            driver_name TEXT NOT NULL,
            transporter TEXT NOT NULL,
            contract_number TEXT NULL,
            relation_name TEXT NULL,
            material TEXT NULL,
            do_number TEXT NULL,
            si_number TEXT NULL,
            container_number TEXT NULL,
            vessel_name TEXT NULL,
            certificate TEXT NULL,
            seal_number TEXT NULL,
            seal_condition TEXT NULL,
            door_locked BOOLEAN DEFAULT false,
            no_leakage BOOLEAN DEFAULT true,
            load_visible BOOLEAN DEFAULT false,
            created_at TIMESTAMP DEFAULT now()
            );
         */
    await queryRunner.query(`
            CREATE TABLE "outgoing_detail" (
            "id" SERIAL NOT NULL,
            "rfid" TEXT NULL DEFAULT NULL,
            "vehicle_number" TEXT NOT NULL,
            "driver_name" TEXT NOT NULL,
            "transporter" TEXT NOT NULL,
            "contract_number" TEXT NULL DEFAULT NULL,
            "relation_name" TEXT NULL DEFAULT NULL,
            "material" TEXT NULL DEFAULT NULL,
            "do_number" TEXT NULL DEFAULT NULL,
            "si_number" TEXT NULL DEFAULT NULL,
            "container_number" TEXT NULL DEFAULT NULL,
            "vessel_name" TEXT NULL DEFAULT NULL,
            "certificate" TEXT NULL DEFAULT NULL,
            "seal_number" TEXT NULL DEFAULT NULL,
            "status" TEXT NULL DEFAULT NULL,
            "created_by" TEXT NULL DEFAULT NULL,
            "created_at" TIMESTAMP NULL DEFAULT now(),
            "updated_at" TIMESTAMP NULL DEFAULT now(),
            "vehicle_type" TEXT NOT NULL,
            PRIMARY KEY ("id")
          )
          ;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS outgoing_detail;`);
  }
}
