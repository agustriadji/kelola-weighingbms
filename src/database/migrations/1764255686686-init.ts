import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1764255686686 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

    // ---------- ROLES ----------
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS roles (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL
      );
    `);

    // ---------- PERMISSIONS ----------
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS permissions (
        id SERIAL PRIMARY KEY,
        name VARCHAR(150) UNIQUE NOT NULL
      );
    `);

    // ---------- ROLE PERMISSIONS ----------
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS role_permissions (
        id SERIAL PRIMARY KEY,
        role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
        permission_id INTEGER REFERENCES permissions(id) ON DELETE CASCADE
      );
    `);

    // ---------- USERS ----------
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        full_name VARCHAR(150),
        role_id INTEGER REFERENCES roles(id),
        last_login TIMESTAMP
      );
    `);

    // ---------- SUPPLIERS ----------
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS suppliers (
        id SERIAL PRIMARY KEY,
        code VARCHAR(50) UNIQUE NOT NULL,
        name VARCHAR(200) NOT NULL,
        sap_id VARCHAR(100),
        last_sync_at TIMESTAMP,
        is_active BOOLEAN DEFAULT true,
        is_deleted BOOLEAN DEFAULT false
      );
    `);

    // ---------- MATERIALS ----------
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS materials (
        id SERIAL PRIMARY KEY,
        code VARCHAR(50) NOT NULL,
        description VARCHAR(200),
        sap_id VARCHAR(100),
        uom VARCHAR(20),
        last_sync_at TIMESTAMP,
        is_active BOOLEAN DEFAULT true,
        is_deleted BOOLEAN DEFAULT false
      );
    `);

    // ---------- VEHICLES ----------
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS vehicles (
        id SERIAL PRIMARY KEY,
        plate VARCHAR(50) UNIQUE NOT NULL,
        type VARCHAR(100),
        owner VARCHAR(200),
        is_active BOOLEAN DEFAULT true,
        is_deleted BOOLEAN DEFAULT false
      );
    `);

    // ---------- DRIVERS ----------
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS drivers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        sim VARCHAR(150) NOT NULL,
        is_active BOOLEAN DEFAULT true,
        is_deleted BOOLEAN DEFAULT false
      );
    `);

    // ---------- WEIGHBRIDGES ----------
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS weighbridges (
        id SERIAL PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        location VARCHAR(200),
        indicator_topic VARCHAR(200),
        config JSONB
      );
    `);

    // ---------- SEGMENTS (optional pause/resume support) ----------
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS segments (
        id SERIAL PRIMARY KEY,
        -- inbound_id INTEGER REFERENCES inbound_ticket(id) ON DELETE CASCADE,
        started_at TIMESTAMP NOT NULL,
        ended_at TIMESTAMP,
        reason VARCHAR(200)
      );
    `);

    // ---------- RECORDS (WEIGHT HISTORY) ----------
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS records (
        id SERIAL PRIMARY KEY,
        -- inbound_id INTEGER REFERENCES inbound_ticket(id) ON DELETE CASCADE,
        segment_id INTEGER REFERENCES segments(id),
        weight FLOAT NOT NULL,
        timestamp TIMESTAMP NOT NULL,
        stable BOOLEAN DEFAULT false,
        source VARCHAR(50)
      );
    `);

    // ---------- AUDIT LOG ----------
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id SERIAL PRIMARY KEY,
        entity VARCHAR(100) NOT NULL,
        entity_id VARCHAR(50) NOT NULL,
        action VARCHAR(50) NOT NULL,
        payload JSONB NOT NULL,
        user_id INTEGER REFERENCES users(id),
        created_at TIMESTAMP NOT NULL
      );
    `);

    // ---------- SYNC QUEUE (BullMQ) ----------
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS sync_queue (
        id SERIAL PRIMARY KEY,
        payload JSONB NOT NULL,
        type VARCHAR(100) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        tries INTEGER DEFAULT 0,
        last_error TEXT,
        created_at TIMESTAMP NOT NULL,
        processed_at TIMESTAMP
      );
    `);

    // ---------- MASTER SYNC STATUS ----------
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS master_sync_status (
        id SERIAL PRIMARY KEY,
        master_type VARCHAR(100) NOT NULL,
        last_sync_at TIMESTAMP
      );
    `);


  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP EXTENSION IF EXISTS "uuid-ossp";`);
    await queryRunner.query(`DROP TABLE master_sync_status`);
    await queryRunner.query(`DROP TABLE sync_queue`);
    await queryRunner.query(`DROP TABLE audit_logs`);
    await queryRunner.query(`DROP TABLE records`);
    await queryRunner.query(`DROP TABLE segments`);
    await queryRunner.query(`DROP TABLE batches`);
    await queryRunner.query(`DROP TABLE weighbridges`);
    await queryRunner.query(`DROP TABLE drivers`);
    await queryRunner.query(`DROP TABLE vehicles`);
    await queryRunner.query(`DROP TABLE materials`);
    await queryRunner.query(`DROP TABLE suppliers`);
    await queryRunner.query(`DROP TABLE users`);
    await queryRunner.query(`DROP TABLE role_permissions`);
    await queryRunner.query(`DROP TABLE permissions`);
    await queryRunner.query(`DROP TABLE roles`);
  }
}
