import { MigrationInterface, QueryRunner } from 'typeorm';

export class RecreateEnumWithRejected1764900000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create temporary table to backup data with text type
    await queryRunner.query(`
      CREATE TEMP TABLE inbound_ticket_backup AS 
      SELECT id, transaction_type, transaction_id, status::text as status_text, created_at, updated_at, created_by
      FROM inbound_ticket;
    `);
    
    // Drop column with enum
    await queryRunner.query(`ALTER TABLE inbound_ticket DROP COLUMN status;`);
    
    // Drop and recreate enum
    await queryRunner.query(`DROP TYPE IF EXISTS inbound_status_enum;`);
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
        'finished',
        'rejected'
      );
    `);
    
    // Add column back with new enum
    await queryRunner.query(`
      ALTER TABLE inbound_ticket 
      ADD COLUMN status inbound_status_enum DEFAULT 'registered';
    `);
    
    // Restore data from backup
    await queryRunner.query(`
      UPDATE inbound_ticket 
      SET status = backup.status_text::inbound_status_enum
      FROM inbound_ticket_backup backup 
      WHERE inbound_ticket.id = backup.id;
    `);
    
    // Clean up temporary table
    await queryRunner.query(`DROP TABLE IF EXISTS inbound_ticket_backup;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Create temporary table to backup data with text type
    await queryRunner.query(`
      CREATE TEMP TABLE inbound_ticket_backup AS 
      SELECT id, transaction_type, transaction_id, status::text as status_text, created_at, updated_at, created_by
      FROM inbound_ticket;
    `);
    
    // Drop column with enum
    await queryRunner.query(`ALTER TABLE inbound_ticket DROP COLUMN status;`);
    
    // Drop and recreate enum without rejected
    await queryRunner.query(`DROP TYPE IF EXISTS inbound_status_enum;`);
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
    
    // Add column back with old enum
    await queryRunner.query(`
      ALTER TABLE inbound_ticket 
      ADD COLUMN status inbound_status_enum DEFAULT 'registered';
    `);
    
    // Restore data from backup (skip rejected status)
    await queryRunner.query(`
      UPDATE inbound_ticket 
      SET status = CASE 
        WHEN backup.status_text = 'rejected' THEN 'registered'
        ELSE backup.status_text::inbound_status_enum
      END
      FROM inbound_ticket_backup backup 
      WHERE inbound_ticket.id = backup.id;
    `);
    
    // Clean up temporary table
    await queryRunner.query(`DROP TABLE IF EXISTS inbound_ticket_backup;`);
  }
}