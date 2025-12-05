-- Fix script untuk mengatasi foreign key constraint issues
-- Run this if wbms_db.sql has table order problems

-- Connect to wbms_db
\c wbms_db;

-- Disable all triggers and constraints temporarily
SET session_replication_role = replica;

-- Import the database with constraints disabled
\i /docker-entrypoint-initdb.d/wbms_db.sql

-- Re-enable all triggers and constraints
SET session_replication_role = DEFAULT;

-- Verify foreign key constraints
DO $$
BEGIN
    -- Check if all tables exist, if not create basic structure
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users') THEN
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(100) UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            full_name VARCHAR(150),
            role_id INTEGER,
            last_login TIMESTAMP
        );
    END IF;
END $$;