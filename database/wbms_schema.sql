-- WBMS Database Schema
-- Generated from TypeORM entities

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(200),
    email VARCHAR(150),
    role_id INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Roles table
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

-- Permissions table
CREATE TABLE permissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) UNIQUE NOT NULL
);

-- Role permissions junction table
CREATE TABLE role_permissions (
    id SERIAL PRIMARY KEY,
    role_id INTEGER REFERENCES roles(id),
    permission_id INTEGER REFERENCES permissions(id)
);

-- Suppliers table
CREATE TABLE suppliers (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    sap_id VARCHAR(100),
    last_sync_at TIMESTAMP
);

-- Materials table
CREATE TABLE materials (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL,
    description VARCHAR(200) NOT NULL,
    sap_id VARCHAR(100),
    uom VARCHAR(20),
    last_sync_at TIMESTAMP
);

-- Vehicles table
CREATE TABLE vehicles (
    id SERIAL PRIMARY KEY,
    license_plate VARCHAR(20) UNIQUE NOT NULL,
    vehicle_type VARCHAR(50),
    capacity FLOAT,
    tarra_weight FLOAT,
    last_tarra_date TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- Drivers table
CREATE TABLE drivers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    sim VARCHAR(50)
);

-- Weighbridges table
CREATE TABLE weighbridges (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    location VARCHAR(200) NOT NULL,
    indicator_topic VARCHAR(200),
    config JSONB
);

-- Incoming detail table
CREATE TABLE incoming_detail (
    id SERIAL PRIMARY KEY,
    rfid VARCHAR,
    vehicle_number VARCHAR NOT NULL,
    vehicle_type VARCHAR NOT NULL,
    driver_name VARCHAR NOT NULL,
    driver_id VARCHAR NOT NULL,
    container_number VARCHAR NOT NULL,
    transporter VARCHAR NOT NULL,
    po_number VARCHAR,
    contract_number VARCHAR,
    supplier VARCHAR,
    material VARCHAR,
    mill_original VARCHAR,
    do_number VARCHAR,
    certificate VARCHAR,
    spb_number VARCHAR,
    spb_date VARCHAR,
    bc_type VARCHAR,
    bc_number VARCHAR,
    bc_status VARCHAR,
    seal_number VARCHAR,
    ffa VARCHAR,
    moist VARCHAR,
    impurity VARCHAR,
    status VARCHAR,
    created_by VARCHAR,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Outgoing detail table
CREATE TABLE outgoing_detail (
    id SERIAL PRIMARY KEY,
    rfid VARCHAR,
    vehicle_number VARCHAR,
    vehicle_type VARCHAR,
    driver_name VARCHAR,
    transporter VARCHAR NOT NULL,
    container_number VARCHAR,
    contract_number VARCHAR,
    relation_name VARCHAR,
    material VARCHAR,
    do_number VARCHAR,
    si_number VARCHAR,
    vessel_name VARCHAR,
    certificate VARCHAR,
    seal_number VARCHAR,
    status VARCHAR,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Misc detail table
CREATE TABLE misc_detail (
    id SERIAL PRIMARY KEY,
    rfid VARCHAR,
    vehicle_number VARCHAR,
    vehicle_type VARCHAR,
    driver_name VARCHAR,
    driver_id VARCHAR,
    container_number VARCHAR,
    transporter VARCHAR,
    do_number VARCHAR,
    po_number VARCHAR,
    contract_number VARCHAR,
    material VARCHAR,
    supplier VARCHAR,
    bc_type VARCHAR,
    bc_number VARCHAR,
    seal_number VARCHAR,
    status VARCHAR,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inbound ticket table
CREATE TABLE inbound_ticket (
    id SERIAL PRIMARY KEY,
    transaction_type VARCHAR NOT NULL,
    transaction_id INTEGER NOT NULL,
    status VARCHAR DEFAULT 'QUEUE_IN',
    weigh_in_id INTEGER,
    weigh_out_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Weigh in table
CREATE TABLE weigh_in (
    id SERIAL PRIMARY KEY,
    inbound_id INTEGER,
    weight FLOAT,
    weight_type VARCHAR CHECK (weight_type IN ('BRUTTO', 'TARRA')),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cctv_url VARCHAR,
    stable BOOLEAN DEFAULT false,
    approved BOOLEAN DEFAULT false,
    created_by INTEGER
);

-- Weigh out table
CREATE TABLE weigh_out (
    id SERIAL PRIMARY KEY,
    inbound_id INTEGER,
    weight FLOAT,
    weight_type VARCHAR CHECK (weight_type IN ('BRUTTO', 'TARRA')),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    netto FLOAT,
    expected_netto FLOAT,
    shrinkage_value FLOAT,
    shrinkage_percent FLOAT,
    warning_flag BOOLEAN DEFAULT false,
    cctv_url VARCHAR,
    status VARCHAR DEFAULT 'closing',
    closed_at TIMESTAMP
);

-- Batches table
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

-- Records table
CREATE TABLE records (
    id SERIAL PRIMARY KEY,
    weight FLOAT NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    stable BOOLEAN DEFAULT false,
    source VARCHAR(50)
);

-- Segments table
CREATE TABLE segments (
    id SERIAL PRIMARY KEY,
    started_at TIMESTAMP NOT NULL,
    ended_at TIMESTAMP,
    reason VARCHAR(200)
);

-- Audit logs table
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    entity VARCHAR(100) NOT NULL,
    entity_id VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    payload JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sync queue table
CREATE TABLE sync_queue (
    id SERIAL PRIMARY KEY,
    payload JSONB NOT NULL,
    type VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    tries INTEGER DEFAULT 0,
    last_error TEXT,
    created_at TIMESTAMP NOT NULL,
    processed_at TIMESTAMP
);

-- Master sync status table
CREATE TABLE master_sync_status (
    id SERIAL PRIMARY KEY,
    master_type VARCHAR(100) NOT NULL,
    last_sync_at TIMESTAMP
);

-- Inbound transaction table
CREATE TABLE inbound_transaction (
    id SERIAL PRIMARY KEY,
    document_type VARCHAR,
    do_number VARCHAR,
    po_number VARCHAR,
    sj_number VARCHAR,
    seal_number VARCHAR,
    seal_range VARCHAR,
    seal_condition VARCHAR,
    door_locked BOOLEAN DEFAULT false,
    no_leakage BOOLEAN DEFAULT false,
    load_visible BOOLEAN DEFAULT false,
    entry_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR DEFAULT 'waiting-weighin'
);