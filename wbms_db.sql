-- ============================================
-- WBMS FULL DATABASE RESET (POSTGRESQL)
-- PLAN B: FULL SCHEMA + FULL SEED
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- DROP TABLES (ORDERED)
-- ============================================

DROP TABLE IF EXISTS records CASCADE;
DROP TABLE IF EXISTS segments CASCADE;
DROP TABLE IF EXISTS batches CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS role_permissions CASCADE;
DROP TABLE IF EXISTS permissions CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS drivers CASCADE;
DROP TABLE IF EXISTS materials CASCADE;
DROP TABLE IF EXISTS suppliers CASCADE;
DROP TABLE IF EXISTS vehicles CASCADE;
DROP TABLE IF EXISTS weighbridges CASCADE;
DROP TABLE IF EXISTS sync_queue CASCADE;
DROP TABLE IF EXISTS master_sync_status CASCADE;

-- ============================================
-- VEHICLES
-- ============================================

CREATE TABLE vehicles (
  id SERIAL PRIMARY KEY,
  plate VARCHAR(50) NOT NULL,
  type VARCHAR(100),
  owner VARCHAR(200)
);

INSERT INTO vehicles (id, plate, type, owner) VALUES
  (1, 'B1234AB', 'TRUCK', 'PT Transport Satu'),
  (2, 'B5678CD', 'TRUCK', 'CV Transport Dua'),
  (3, 'D9012EF', 'TRAILER', 'PT Transport Tiga')
ON CONFLICT (id) DO UPDATE SET
  plate = EXCLUDED.plate,
  type = EXCLUDED.type,
  owner = EXCLUDED.owner;

-- ============================================
-- SUPPLIERS
-- ============================================

CREATE TABLE suppliers (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) NOT NULL,
  name VARCHAR(200) NOT NULL,
  sap_id VARCHAR(100),
  last_sync_at TIMESTAMP
);

INSERT INTO suppliers (id, code, name, sap_id, last_sync_at) VALUES
  (1, 'SUP001', 'PT. Jaya Chemical', 'SAP001', NULL),
  (2, 'SUP002', 'PT. Samudera Transport', 'SAP002', NULL),
  (3, 'SUP003', 'PT. SEI Palm Oil', 'SAP003', NULL),
  (4, 'SUP004', 'CV. Mitra Sejahtera', 'SAP004', NULL)
ON CONFLICT (id) DO UPDATE SET
  code = EXCLUDED.code,
  name = EXCLUDED.name,
  sap_id = EXCLUDED.sap_id,
  last_sync_at = EXCLUDED.last_sync_at;

-- ============================================
-- MATERIALS
-- ============================================

CREATE TABLE materials (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) NOT NULL,
  description VARCHAR(200),
  sap_id VARCHAR(100),
  uom VARCHAR(20),
  last_sync_at TIMESTAMP
);

INSERT INTO materials (id, code, description, sap_id, uom, last_sync_at) VALUES
  (1, 'MAT001', 'Raw Material A', NULL, 'KG', NULL),
  (2, 'MAT002', 'Raw Material B', NULL, 'TON', NULL),
  (3, 'MAT003', 'Finished Product A', NULL, 'KG', NULL),
  (4, 'MAT004', 'Finished Product B', NULL, 'TON', NULL)
ON CONFLICT (id) DO UPDATE SET
  code = EXCLUDED.code,
  description = EXCLUDED.description,
  sap_id = EXCLUDED.sap_id,
  uom = EXCLUDED.uom,
  last_sync_at = EXCLUDED.last_sync_at;

-- ============================================
-- DRIVERS
-- ============================================

CREATE TABLE drivers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  phone VARCHAR(50)
);

INSERT INTO drivers (id, name, phone) VALUES
  (1, 'Budi Santoso', '081234567890'),
  (2, 'Ahmad Wijaya', '081987654321'),
  (3, 'Siti Nurhaliza', '081122334455')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone;

-- ============================================
-- ROLES
-- ============================================

CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

INSERT INTO roles (id, name) VALUES
  (1, 'Admin'),
  (2, 'Supervisor'),
  (3, 'Operator'),
  (4, 'Viewer')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- ============================================
-- PERMISSIONS
-- ============================================

CREATE TABLE permissions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL
);

INSERT INTO permissions (id, name) VALUES
  (1, 'view_dashboard'),
  (2, 'view_weighing'),
  (3, 'create_weighing'),
  (4, 'update_weighing'),
  (5, 'delete_weighing'),
  (6, 'view_users'),
  (7, 'create_users'),
  (8, 'update_users'),
  (9, 'delete_users'),
  (10, 'view_reports'),
  (11, 'export_reports'),
  (12, 'manage_system')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name;

-- ============================================
-- ROLE PERMISSIONS
-- ============================================

CREATE TABLE role_permissions (
  id SERIAL PRIMARY KEY,
  role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
  permission_id INTEGER REFERENCES permissions(id) ON DELETE CASCADE
);

INSERT INTO role_permissions (id, role_id, permission_id) VALUES
  (183, 1, 1), (184, 1, 2), (185, 1, 3), (186, 1, 4), (187, 1, 5),
  (188, 1, 6), (189, 1, 7), (190, 1, 8), (191, 1, 9), (192, 1, 10),
  (193, 1, 11), (194, 1, 12),
  (195, 2, 1), (196, 2, 2), (197, 2, 3), (198, 2, 4),
  (199, 2, 6), (200, 2, 10), (201, 2, 11),
  (202, 3, 1), (203, 3, 2), (204, 3, 3), (205, 3, 4),
  (206, 4, 1), (207, 4, 2), (208, 4, 10)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- USERS
-- ============================================

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  password_hash TEXT NOT NULL,
  full_name VARCHAR(150),
  role_id INTEGER REFERENCES roles(id),
  last_login TIMESTAMP
);

INSERT INTO users (id, username, password_hash, full_name, role_id, last_login) VALUES
  (9, 'agus', '$2b$10$SmcHmAGonUsHIRornauF/eZoABFmvUqG6k03u4Szbtw372j9eH/Qq', 'agus triadji', 1, NULL),
  (23, 'supervisor', '$2b$10$HBwQTYszCVdZzpmYINayseQZYOK55CJJZsdV3PwApxwdRvmMAY0MK', 'Supervisor User', 2, NULL),
  (24, 'operator', '$2b$10$QrATpJMXxp6s/S8RxboMJOy5H4V1oCuAEpbJppXpWXAllP9v0VwXm', 'Operator User', 3, NULL),
  (25, 'viewer', '$2b$10$OgCDxoKyF1ukT4G4MOEp2.v5B2p89hxA.MrjhE.JdYJ46zy1J92wa', 'Viewer User', 4, NULL),
  (22, 'admin', '$2b$10$q4J1mGIJPJ6uQMikz0mYl.bWjNdBejZ4HLM7q2SamuKpq.ak3njtO', 'System Administrator', 1, '2025-11-28 04:09:33.83')
ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  password_hash = EXCLUDED.password_hash,
  full_name = EXCLUDED.full_name,
  role_id = EXCLUDED.role_id,
  last_login = EXCLUDED.last_login;

-- ============================================
-- AUDIT LOGS
-- ============================================

CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  entity VARCHAR(100) NOT NULL,
  entity_id VARCHAR(50) NOT NULL,
  action VARCHAR(50) NOT NULL,
  payload JSONB NOT NULL,
  user_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP NOT NULL
);

-- ============================================
-- BATCHES
-- ============================================

CREATE TABLE batches (
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

INSERT INTO batches (id, batch_name, vehicle_id, supplier_id, material_id, created_by, status, started_at, ended_at, expected_netto, actual_netto, shrinkage_value, shrinkage_percent, warning_flag) VALUES
  (4, 'sadasd', 1, 1, 1, 22, 'finished', '2025-11-28 04:14:40.072', '2025-11-28 04:15:02.064', NULL, NULL, NULL, NULL, NULL),
  (3, 'BATCH2', 1, 2, 2, 22, 'finished', '2025-11-28 04:15:15.85', '2025-11-28 04:15:21.178', NULL, NULL, NULL, NULL, NULL),
  (2, 'BATCH2', 1, 1, 1, 22, 'finished', '2025-11-28 04:15:27.387', '2025-11-28 04:20:07.775', NULL, NULL, NULL, NULL, NULL),
  (1, 'TEST', 1, 1, 1, 22, 'finished', '2025-11-28 04:20:17.213', '2025-11-28 04:20:18.707', NULL, NULL, NULL, NULL, NULL),
  (5, 'TEST', 3, 4, 4, 22, 'finished', '2025-11-28 04:20:58.913', '2025-11-28 04:21:07.349', NULL, NULL, NULL, NULL, NULL)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- SEGMENTS
-- ============================================

CREATE TABLE segments (
  id SERIAL PRIMARY KEY,
  batch_id INTEGER REFERENCES batches(id) ON DELETE CASCADE,
  started_at TIMESTAMP NOT NULL,
  ended_at TIMESTAMP,
  reason VARCHAR(200)
);

-- ============================================
-- RECORDS
-- ============================================

CREATE TABLE records (
  id SERIAL PRIMARY KEY,
  batch_id INTEGER REFERENCES batches(id) ON DELETE CASCADE,
  segment_id INTEGER REFERENCES segments(id),
  weight DOUBLE PRECISION NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  stable BOOLEAN DEFAULT FALSE,
  source VARCHAR(50)
);

-- ============================================
-- SYNC QUEUE
-- ============================================

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

-- ============================================
-- WEIGHBRIDGES
-- ============================================

CREATE TABLE weighbridges (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  location VARCHAR(200),
  indicator_topic VARCHAR(200),
  config JSONB
);

INSERT INTO weighbridges (id, name, location, indicator_topic, config) VALUES
  (1, 'Weighbridge 1', 'Gate A', NULL, NULL),
  (2, 'Weighbridge 2', 'Gate B', NULL, NULL)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- MASTER SYNC STATUS
-- ============================================

CREATE TABLE master_sync_status (
  id SERIAL PRIMARY KEY,
  master_type VARCHAR(100) NOT NULL,
  last_sync_at TIMESTAMP
);

-- ============================================
-- RESET SEQUENCES
-- ============================================

SELECT setval('batches_id_seq', COALESCE((SELECT MAX(id) FROM batches), 0) + 1, false);
SELECT setval('users_id_seq', COALESCE((SELECT MAX(id) FROM users), 0) + 1, false);
SELECT setval('roles_id_seq', COALESCE((SELECT MAX(id) FROM roles), 0) + 1, false);
SELECT setval('permissions_id_seq', COALESCE((SELECT MAX(id) FROM permissions), 0) + 1, false);
SELECT setval('role_permissions_id_seq', COALESCE((SELECT MAX(id) FROM role_permissions), 0) + 1, false);
SELECT setval('suppliers_id_seq', COALESCE((SELECT MAX(id) FROM suppliers), 0) + 1, false);
SELECT setval('materials_id_seq', COALESCE((SELECT MAX(id) FROM materials), 0) + 1, false);
SELECT setval('vehicles_id_seq', COALESCE((SELECT MAX(id) FROM vehicles), 0) + 1, false);
SELECT setval('drivers_id_seq', COALESCE((SELECT MAX(id) FROM drivers), 0) + 1, false);
SELECT setval('weighbridges_id_seq', COALESCE((SELECT MAX(id) FROM weighbridges), 0) + 1, false);
SELECT setval('audit_logs_id_seq', COALESCE((SELECT MAX(id) FROM audit_logs), 0) + 1, false);
SELECT setval('segments_id_seq', COALESCE((SELECT MAX(id) FROM segments), 0) + 1, false);
SELECT setval('records_id_seq', COALESCE((SELECT MAX(id) FROM records), 0) + 1, false);
SELECT setval('sync_queue_id_seq', COALESCE((SELECT MAX(id) FROM sync_queue), 0) + 1, false);
SELECT setval('master_sync_status_id_seq', COALESCE((SELECT MAX(id) FROM master_sync_status), 0) + 1, false);

-- ============================================
-- DONE
-- ============================================

