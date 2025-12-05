import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateIncomingDetail1764660580610 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    /**
         * CREATE TABLE incoming_detail (
            id SERIAL PRIMARY KEY,
            rfid TEXT NULL,
            vehicle_number TEXT NOT NULL,
            driver_name TEXT NOT NULL,
            transporter TEXT NOT NULL,
            po_number TEXT NULL,
            contract_number TEXT NULL,
            supplier TEXT NULL,
            material TEXT NULL,
            mill_original_supplier TEXT NULL,
            do_number TEXT NULL,
            spb_number TEXT NULL,
            spb_date TEXT NULL,
            ffa FLOAT NULL,
            moist FLOAT NULL,
            impurity FLOAT NULL,
            bc_type TEXT NULL,
            bc_number TEXT NULL,
            certificate TEXT NULL,
            status TEXT NULL,
            created_by TEXT NULL,
            created_at TIMESTAMP DEFAULT now(),
            updated_at TIMESTAMP DEFAULT now()
            );

         */
    await queryRunner.query(`
            CREATE TABLE "incoming_detail" (
            "id" SERIAL NOT NULL,
            "rfid" TEXT NULL DEFAULT NULL,
            "vehicle_number" TEXT NOT NULL,
            "driver_name" TEXT NOT NULL,
            "transporter" TEXT NOT NULL,
            "po_number" TEXT NULL DEFAULT NULL,
            "contract_number" TEXT NULL DEFAULT NULL,
            "supplier" TEXT NULL DEFAULT NULL,
            "material" TEXT NULL DEFAULT NULL,
            "mill_original" TEXT NULL DEFAULT NULL,
            "do_number" TEXT NULL DEFAULT NULL,
            "spb_number" TEXT NULL DEFAULT NULL,
            "spb_date" TEXT NULL DEFAULT NULL,
            "ffa" TEXT NULL DEFAULT NULL,
            "moist" TEXT NULL DEFAULT NULL,
            "impurity" TEXT NULL DEFAULT NULL,
            "bc_type" TEXT NULL DEFAULT NULL,
            "bc_number" TEXT NULL DEFAULT NULL,
            "certificate" TEXT NULL DEFAULT NULL,
            "status" TEXT NULL DEFAULT NULL,
            "created_by" TEXT NULL DEFAULT NULL,
            "created_at" TIMESTAMP NULL DEFAULT now(),
            "updated_at" TIMESTAMP NULL DEFAULT now(),
            "driver_id" TEXT NOT NULL,
            "bc_status" TEXT NULL DEFAULT NULL,
            "vehicle_type" TEXT NOT NULL,
            "container_number" TEXT NULL DEFAULT NULL,
            "seal_number" TEXT NULL DEFAULT NULL,
            PRIMARY KEY ("id")
          );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS incoming_detail;`);
  }
}
