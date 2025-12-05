import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMiscDetail1764660594669 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    /**
         * CREATE TABLE misc_detail (
            id SERIAL PRIMARY KEY,
            rfid TEXT NULL,
            vehicle_number TEXT NOT NULL,
            driver_name TEXT NOT NULL,
            transporter TEXT NOT NULL,
            relation_name TEXT NULL,
            material TEXT NULL,
            bc_type TEXT NULL,
            bc_number TEXT NULL,
            do_number TEXT NULL,
            seal_number TEXT NULL,
            seal_condition TEXT NULL,
            door_locked BOOLEAN DEFAULT false,
            no_leakage BOOLEAN DEFAULT true,
            load_visible BOOLEAN DEFAULT false,
            created_at TIMESTAMP DEFAULT now()
            );
         */
    await queryRunner.query(`
            CREATE TABLE "misc_detail" (
            "id" SERIAL NOT NULL,
            "rfid" TEXT NULL DEFAULT NULL,
            "po_number" TEXT NULL DEFAULT NULL,
            "contract_number" TEXT NULL DEFAULT NULL,
            "supplier" TEXT NULL DEFAULT NULL,
            "material" TEXT NULL DEFAULT NULL,
            "do_number" TEXT NULL DEFAULT NULL,
            "vehicle_number" TEXT NOT NULL,
            "vehicle_type" TEXT NULL DEFAULT NULL,
            "container_number" TEXT NULL DEFAULT NULL,
            "driver_name" TEXT NOT NULL,
            "driver_id" TEXT NULL DEFAULT NULL,
            "transporter" TEXT NOT NULL,
            "bc_type" TEXT NULL DEFAULT NULL,
            "bc_number" TEXT NULL DEFAULT NULL,
            "seal_number" TEXT NULL DEFAULT NULL,
            "status" TEXT NULL DEFAULT NULL,
            "created_by" TEXT NULL DEFAULT NULL,
            "created_at" TIMESTAMP NULL DEFAULT now(),
            "updated_at" TIMESTAMP NULL DEFAULT now(),
            PRIMARY KEY ("id")
          );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS misc_detail;`);
  }
}
