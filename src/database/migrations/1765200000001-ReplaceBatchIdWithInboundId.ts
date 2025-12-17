import { MigrationInterface, QueryRunner } from 'typeorm';

export class ReplaceBatchIdWithInboundId1765200000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add started_at and reason fields to inbound_ticket if not exists
    await queryRunner.query(`
      ALTER TABLE inbound_ticket 
      ADD COLUMN IF NOT EXISTS started_at TIMESTAMP NULL;
    `);

    await queryRunner.query(`
      ALTER TABLE inbound_ticket 
      ADD COLUMN IF NOT EXISTS reason TEXT NULL;
    `);

    // Drop foreign key constraints first if they exist
    await queryRunner.query(`
      ALTER TABLE records 
      DROP CONSTRAINT IF EXISTS FK_records_batch_id;
    `);

    await queryRunner.query(`
      ALTER TABLE segments 
      DROP CONSTRAINT IF EXISTS FK_segments_batch_id;
    `);

    // Drop batch_id columns from records table
    await queryRunner.query(`
      ALTER TABLE records 
      DROP COLUMN IF EXISTS batch_id;
    `);

    // Drop batch_id columns from segments table  
    await queryRunner.query(`
      ALTER TABLE segments 
      DROP COLUMN IF EXISTS batch_id;
    `);

    // Add inbound_id columns
    await queryRunner.query(`
      ALTER TABLE records 
      ADD COLUMN inbound_id INTEGER NULL;
    `);

    await queryRunner.query(`
      ALTER TABLE segments 
      ADD COLUMN inbound_id INTEGER NULL;
    `);

    // Add foreign key constraints to inbound_ticket
    await queryRunner.query(`
      ALTER TABLE records 
      ADD CONSTRAINT FK_records_inbound_id 
      FOREIGN KEY (inbound_id) REFERENCES inbound_ticket(id) 
      ON DELETE SET NULL;
    `);

    await queryRunner.query(`
      ALTER TABLE segments 
      ADD CONSTRAINT FK_segments_inbound_id 
      FOREIGN KEY (inbound_id) REFERENCES inbound_ticket(id) 
      ON DELETE SET NULL;
    `);

    // Drop batches table if it exists
    await queryRunner.query(`
      DROP TABLE IF EXISTS batches;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Recreate batches table
    await queryRunner.query(`
      CREATE TABLE batches (
        id SERIAL PRIMARY KEY,
        batch_name VARCHAR(100) NOT NULL,
        vehicle_id INTEGER,
        supplier_id INTEGER,
        material_id INTEGER,
        created_by INTEGER,
        status VARCHAR(50) NOT NULL,
        ended_at TIMESTAMP,
        expected_netto FLOAT,
        actual_netto FLOAT,
        shrinkage_value FLOAT,
        shrinkage_percent FLOAT,
        warning_flag BOOLEAN
      );
    `);

    // Drop foreign key constraints
    await queryRunner.query(`
      ALTER TABLE records 
      DROP CONSTRAINT IF EXISTS FK_records_inbound_id;
    `);

    await queryRunner.query(`
      ALTER TABLE segments 
      DROP CONSTRAINT IF EXISTS FK_segments_inbound_id;
    `);

    // Drop inbound_id columns
    await queryRunner.query(`
      ALTER TABLE records 
      DROP COLUMN IF EXISTS inbound_id;
    `);

    await queryRunner.query(`
      ALTER TABLE segments 
      DROP COLUMN IF EXISTS inbound_id;
    `);

    // Add batch_id columns back
    await queryRunner.query(`
      ALTER TABLE records 
      ADD COLUMN batch_id INTEGER NULL;
    `);

    await queryRunner.query(`
      ALTER TABLE segments 
      ADD COLUMN batch_id INTEGER NULL;
    `);

    // Add foreign key constraints to batches
    await queryRunner.query(`
      ALTER TABLE records 
      ADD CONSTRAINT FK_records_batch_id 
      FOREIGN KEY (batch_id) REFERENCES batches(id) 
      ON DELETE SET NULL;
    `);

    await queryRunner.query(`
      ALTER TABLE segments 
      ADD CONSTRAINT FK_segments_batch_id 
      FOREIGN KEY (batch_id) REFERENCES batches(id) 
      ON DELETE SET NULL;
    `);

    // Remove started_at and reason from inbound_ticket
    await queryRunner.query(`
      ALTER TABLE inbound_ticket 
      DROP COLUMN IF EXISTS started_at;
    `);

    await queryRunner.query(`
      ALTER TABLE inbound_ticket 
      DROP COLUMN IF EXISTS reason;
    `);
  }
}