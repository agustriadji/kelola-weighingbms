-- Create tables in correct order to avoid foreign key issues
-- This will run before importing wbms_db.sql

\c wbms_db;

-- Create tables in dependency order (parent tables first)

-- 1. Independent tables first
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS permissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS suppliers (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    sap_id VARCHAR(100),
    last_sync_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS materials (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL,
    description VARCHAR(200),
    sap_id VARCHAR(100),
    uom VARCHAR(20),
    last_sync_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vehicles (
    id SERIAL PRIMARY KEY,
    plate VARCHAR(50) UNIQUE NOT NULL,
    type VARCHAR(100),
    owner VARCHAR(200)
);

CREATE TABLE IF NOT EXISTS drivers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS weighbridges (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    location VARCHAR(200),
    indicator_topic VARCHAR(200),
    config JSONB
);

-- 2. Tables with foreign keys to above tables
CREATE TABLE IF NOT EXISTS role_permissions (
    id SERIAL PRIMARY KEY,
    role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
    permission_id INTEGER REFERENCES permissions(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name VARCHAR(150),
    role_id INTEGER REFERENCES roles(id),
    last_login TIMESTAMP
);

-- 3. Tables with foreign keys to users and other tables
CREATE TABLE IF NOT EXISTS batches (
    id SERIAL PRIMARY KEY,
    batch_name VARCHAR(100) NOT NULL,
    vehicle_id INTEGER REFERENCES vehicles(id),
    supplier_id INTEGER REFERENCES suppliers(id),
    material_id INTEGER REFERENCES materials(id),
    created_by INTEGER REFERENCES users(id),
    status VARCHAR(50) NOT NULL,
    started_at TIMESTAMP,
    ended_at TIMESTAMP,
    expected_netto DOUBLE PRECISION,
    actual_netto DOUBLE PRECISION,
    shrinkage_value DOUBLE PRECISION,
    shrinkage_percent DOUBLE PRECISION,
    warning_flag BOOLEAN
);

CREATE TABLE IF NOT EXISTS segments (
    id SERIAL PRIMARY KEY,
    batch_id INTEGER REFERENCES batches(id) ON DELETE CASCADE,
    started_at TIMESTAMP NOT NULL,
    ended_at TIMESTAMP,
    reason VARCHAR(200)
);

CREATE TABLE IF NOT EXISTS records (
    id SERIAL PRIMARY KEY,
    batch_id INTEGER REFERENCES batches(id) ON DELETE CASCADE,
    segment_id INTEGER REFERENCES segments(id),
    weight FLOAT NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    stable BOOLEAN DEFAULT false,
    source VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    entity VARCHAR(100) NOT NULL,
    entity_id VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    payload JSONB NOT NULL,
    user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP NOT NULL
);

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

CREATE TABLE IF NOT EXISTS master_sync_status (
    id SERIAL PRIMARY KEY,
    master_type VARCHAR(100) NOT NULL,
    last_sync_at TIMESTAMP
);