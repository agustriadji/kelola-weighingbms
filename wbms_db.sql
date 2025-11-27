/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES  */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

DROP TABLE IF EXISTS "audit_logs";
CREATE TABLE IF NOT EXISTS "audit_logs" (
	"id" SERIAL NOT NULL,
	"entity" VARCHAR(100) NOT NULL,
	"entity_id" VARCHAR(50) NOT NULL,
	"action" VARCHAR(50) NOT NULL,
	"payload" JSONB NOT NULL,
	"user_id" INTEGER NULL DEFAULT NULL,
	"created_at" TIMESTAMP NOT NULL,
	PRIMARY KEY ("id"),
	CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION
);

/*!40000 ALTER TABLE "audit_logs" DISABLE KEYS */;
/*!40000 ALTER TABLE "audit_logs" ENABLE KEYS */;

DROP TABLE IF EXISTS "batches";
CREATE TABLE IF NOT EXISTS "batches" (
	"id" SERIAL NOT NULL,
	"batch_name" VARCHAR(100) NOT NULL,
	"vehicle_id" INTEGER NULL DEFAULT NULL,
	"supplier_id" INTEGER NULL DEFAULT NULL,
	"material_id" INTEGER NULL DEFAULT NULL,
	"created_by" INTEGER NULL DEFAULT NULL,
	"status" VARCHAR(50) NOT NULL,
	"started_at" TIMESTAMP NULL DEFAULT NULL,
	"ended_at" TIMESTAMP NULL DEFAULT NULL,
	"expected_netto" DOUBLE PRECISION NULL DEFAULT NULL,
	"actual_netto" DOUBLE PRECISION NULL DEFAULT NULL,
	"shrinkage_value" DOUBLE PRECISION NULL DEFAULT NULL,
	"shrinkage_percent" DOUBLE PRECISION NULL DEFAULT NULL,
	"warning_flag" BOOLEAN NULL DEFAULT NULL,
	PRIMARY KEY ("id"),
	CONSTRAINT "batches_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION,
	CONSTRAINT "batches_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "materials" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION,
	CONSTRAINT "batches_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "suppliers" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION,
	CONSTRAINT "batches_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION
);

/*!40000 ALTER TABLE "batches" DISABLE KEYS */;
REPLACE INTO "batches" ("id", "batch_name", "vehicle_id", "supplier_id", "material_id", "created_by", "status", "started_at", "ended_at", "expected_netto", "actual_netto", "shrinkage_value", "shrinkage_percent", "warning_flag") VALUES
	(4, 'sadasd', 1, 1, 1, 22, 'finished', '2025-11-28 04:14:40.072', '2025-11-28 04:15:02.064', NULL, NULL, NULL, NULL, NULL),
	(3, 'BATCH2', 1, 2, 2, 22, 'finished', '2025-11-28 04:15:15.85', '2025-11-28 04:15:21.178', NULL, NULL, NULL, NULL, NULL),
	(2, 'BATCH2', 1, 1, 1, 22, 'finished', '2025-11-28 04:15:27.387', '2025-11-28 04:20:07.775', NULL, NULL, NULL, NULL, NULL),
	(1, 'TEST', 1, 1, 1, 22, 'finished', '2025-11-28 04:20:17.213', '2025-11-28 04:20:18.707', NULL, NULL, NULL, NULL, NULL),
	(5, 'TEST', 3, 4, 4, 22, 'finished', '2025-11-28 04:20:58.913', '2025-11-28 04:21:07.349', NULL, NULL, NULL, NULL, NULL);
/*!40000 ALTER TABLE "batches" ENABLE KEYS */;

DROP TABLE IF EXISTS "drivers";
CREATE TABLE IF NOT EXISTS "drivers" (
	"id" SERIAL NOT NULL,
	"name" VARCHAR(150) NOT NULL,
	"phone" VARCHAR(50) NULL DEFAULT NULL,
	PRIMARY KEY ("id")
);

/*!40000 ALTER TABLE "drivers" DISABLE KEYS */;
REPLACE INTO "drivers" ("id", "name", "phone") VALUES
	(1, 'Budi Santoso', '081234567890'),
	(2, 'Ahmad Wijaya', '081987654321'),
	(3, 'Siti Nurhaliza', '081122334455');
/*!40000 ALTER TABLE "drivers" ENABLE KEYS */;

DROP TABLE IF EXISTS "master_sync_status";
CREATE TABLE IF NOT EXISTS "master_sync_status" (
	"id" SERIAL NOT NULL,
	"master_type" VARCHAR(100) NOT NULL,
	"last_sync_at" TIMESTAMP NULL DEFAULT NULL,
	PRIMARY KEY ("id")
);

/*!40000 ALTER TABLE "master_sync_status" DISABLE KEYS */;
/*!40000 ALTER TABLE "master_sync_status" ENABLE KEYS */;

DROP TABLE IF EXISTS "materials";
CREATE TABLE IF NOT EXISTS "materials" (
	"id" SERIAL NOT NULL,
	"code" VARCHAR(50) NOT NULL,
	"description" VARCHAR(200) NULL DEFAULT NULL,
	"sap_id" VARCHAR(100) NULL DEFAULT NULL,
	"uom" VARCHAR(20) NULL DEFAULT NULL,
	"last_sync_at" TIMESTAMP NULL DEFAULT NULL,
	PRIMARY KEY ("id")
);

/*!40000 ALTER TABLE "materials" DISABLE KEYS */;
REPLACE INTO "materials" ("id", "code", "description", "sap_id", "uom", "last_sync_at") VALUES
	(1, 'MAT001', 'Raw Material A', NULL, 'KG', NULL),
	(2, 'MAT002', 'Raw Material B', NULL, 'TON', NULL),
	(3, 'MAT003', 'Finished Product A', NULL, 'KG', NULL),
	(4, 'MAT004', 'Finished Product B', NULL, 'TON', NULL);
/*!40000 ALTER TABLE "materials" ENABLE KEYS */;

DROP TABLE IF EXISTS "migrations";
CREATE TABLE IF NOT EXISTS "migrations" (
	"id" SERIAL NOT NULL,
	"timestamp" BIGINT NOT NULL,
	"name" VARCHAR NOT NULL,
	PRIMARY KEY ("id")
);

/*!40000 ALTER TABLE "migrations" DISABLE KEYS */;
REPLACE INTO "migrations" ("id", "timestamp", "name") VALUES
	(1, 1764255686686, 'Init1764255686686');
/*!40000 ALTER TABLE "migrations" ENABLE KEYS */;

DROP TABLE IF EXISTS "permissions";
CREATE TABLE IF NOT EXISTS "permissions" (
	"id" SERIAL NOT NULL,
	"name" VARCHAR(150) NOT NULL,
	PRIMARY KEY ("id"),
	UNIQUE INDEX "permissions_name_key" ("name")
);

/*!40000 ALTER TABLE "permissions" DISABLE KEYS */;
REPLACE INTO "permissions" ("id", "name") VALUES
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
	(12, 'manage_system');
/*!40000 ALTER TABLE "permissions" ENABLE KEYS */;

DROP TABLE IF EXISTS "records";
CREATE TABLE IF NOT EXISTS "records" (
	"id" SERIAL NOT NULL,
	"batch_id" INTEGER NULL DEFAULT NULL,
	"segment_id" INTEGER NULL DEFAULT NULL,
	"weight" DOUBLE PRECISION NOT NULL,
	"timestamp" TIMESTAMP NOT NULL,
	"stable" BOOLEAN NULL DEFAULT false,
	"source" VARCHAR(50) NULL DEFAULT NULL,
	PRIMARY KEY ("id"),
	CONSTRAINT "records_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "batches" ("id") ON UPDATE NO ACTION ON DELETE CASCADE,
	CONSTRAINT "records_segment_id_fkey" FOREIGN KEY ("segment_id") REFERENCES "segments" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION
);

/*!40000 ALTER TABLE "records" DISABLE KEYS */;
/*!40000 ALTER TABLE "records" ENABLE KEYS */;

DROP TABLE IF EXISTS "roles";
CREATE TABLE IF NOT EXISTS "roles" (
	"id" SERIAL NOT NULL,
	"name" VARCHAR(100) NOT NULL,
	PRIMARY KEY ("id"),
	UNIQUE INDEX "roles_name_key" ("name")
);

/*!40000 ALTER TABLE "roles" DISABLE KEYS */;
REPLACE INTO "roles" ("id", "name") VALUES
	(1, 'Admin'),
	(2, 'Supervisor'),
	(3, 'Operator'),
	(4, 'Viewer');
/*!40000 ALTER TABLE "roles" ENABLE KEYS */;

DROP TABLE IF EXISTS "role_permissions";
CREATE TABLE IF NOT EXISTS "role_permissions" (
	"id" SERIAL NOT NULL,
	"role_id" INTEGER NULL DEFAULT NULL,
	"permission_id" INTEGER NULL DEFAULT NULL,
	PRIMARY KEY ("id"),
	CONSTRAINT "role_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions" ("id") ON UPDATE NO ACTION ON DELETE CASCADE,
	CONSTRAINT "role_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles" ("id") ON UPDATE NO ACTION ON DELETE CASCADE
);

/*!40000 ALTER TABLE "role_permissions" DISABLE KEYS */;
REPLACE INTO "role_permissions" ("id", "role_id", "permission_id") VALUES
	(183, 1, 1),
	(184, 1, 2),
	(185, 1, 3),
	(186, 1, 4),
	(187, 1, 5),
	(188, 1, 6),
	(189, 1, 7),
	(190, 1, 8),
	(191, 1, 9),
	(192, 1, 10),
	(193, 1, 11),
	(194, 1, 12),
	(195, 2, 1),
	(196, 2, 2),
	(197, 2, 3),
	(198, 2, 4),
	(199, 2, 6),
	(200, 2, 10),
	(201, 2, 11),
	(202, 3, 1),
	(203, 3, 2),
	(204, 3, 3),
	(205, 3, 4),
	(206, 4, 1),
	(207, 4, 2),
	(208, 4, 10);
/*!40000 ALTER TABLE "role_permissions" ENABLE KEYS */;

DROP TABLE IF EXISTS "segments";
CREATE TABLE IF NOT EXISTS "segments" (
	"id" SERIAL NOT NULL,
	"batch_id" INTEGER NULL DEFAULT NULL,
	"started_at" TIMESTAMP NOT NULL,
	"ended_at" TIMESTAMP NULL DEFAULT NULL,
	"reason" VARCHAR(200) NULL DEFAULT NULL,
	PRIMARY KEY ("id"),
	CONSTRAINT "segments_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "batches" ("id") ON UPDATE NO ACTION ON DELETE CASCADE
);

/*!40000 ALTER TABLE "segments" DISABLE KEYS */;
/*!40000 ALTER TABLE "segments" ENABLE KEYS */;

DROP TABLE IF EXISTS "suppliers";
CREATE TABLE IF NOT EXISTS "suppliers" (
	"id" SERIAL NOT NULL,
	"code" VARCHAR(50) NOT NULL,
	"name" VARCHAR(200) NOT NULL,
	"sap_id" VARCHAR(100) NULL DEFAULT NULL,
	"last_sync_at" TIMESTAMP NULL DEFAULT NULL,
	PRIMARY KEY ("id"),
	UNIQUE INDEX "suppliers_code_key" ("code")
);

/*!40000 ALTER TABLE "suppliers" DISABLE KEYS */;
REPLACE INTO "suppliers" ("id", "code", "name", "sap_id", "last_sync_at") VALUES
	(1, 'SUP001', 'PT. Jaya Chemical', 'SAP001', NULL),
	(2, 'SUP002', 'PT. Samudera Transport', 'SAP002', NULL),
	(3, 'SUP003', 'PT. SEI Palm Oil', 'SAP003', NULL),
	(4, 'SUP004', 'CV. Mitra Sejahtera', 'SAP004', NULL);
/*!40000 ALTER TABLE "suppliers" ENABLE KEYS */;

DROP TABLE IF EXISTS "sync_queue";
CREATE TABLE IF NOT EXISTS "sync_queue" (
	"id" SERIAL NOT NULL,
	"payload" JSONB NOT NULL,
	"type" VARCHAR(100) NOT NULL,
	"status" VARCHAR(50) NULL DEFAULT 'pending',
	"tries" INTEGER NULL DEFAULT 0,
	"last_error" TEXT NULL DEFAULT NULL,
	"created_at" TIMESTAMP NOT NULL,
	"processed_at" TIMESTAMP NULL DEFAULT NULL,
	PRIMARY KEY ("id")
);

/*!40000 ALTER TABLE "sync_queue" DISABLE KEYS */;
/*!40000 ALTER TABLE "sync_queue" ENABLE KEYS */;

DROP TABLE IF EXISTS "users";
CREATE TABLE IF NOT EXISTS "users" (
	"id" SERIAL NOT NULL,
	"username" VARCHAR(100) NOT NULL,
	"password_hash" TEXT NOT NULL,
	"full_name" VARCHAR(150) NULL DEFAULT NULL,
	"role_id" INTEGER NULL DEFAULT NULL,
	"last_login" TIMESTAMP NULL DEFAULT NULL,
	PRIMARY KEY ("id"),
	UNIQUE INDEX "users_username_key" ("username"),
	CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION
);

/*!40000 ALTER TABLE "users" DISABLE KEYS */;
REPLACE INTO "users" ("id", "username", "password_hash", "full_name", "role_id", "last_login") VALUES
	(9, 'agus', '$2b$10$SmcHmAGonUsHIRornauF/eZoABFmvUqG6k03u4Szbtw372j9eH/Qq', 'agus triadji', 1, NULL),
	(23, 'supervisor', '$2b$10$HBwQTYszCVdZzpmYINayseQZYOK55CJJZsdV3PwApxwdRvmMAY0MK', 'Supervisor User', 2, NULL),
	(24, 'operator', '$2b$10$QrATpJMXxp6s/S8RxboMJOy5H4V1oCuAEpbJppXpWXAllP9v0VwXm', 'Operator User', 3, NULL),
	(25, 'viewer', '$2b$10$OgCDxoKyF1ukT4G4MOEp2.v5B2p89hxA.MrjhE.JdYJ46zy1J92wa', 'Viewer User', 4, NULL),
	(22, 'admin', '$2b$10$q4J1mGIJPJ6uQMikz0mYl.bWjNdBejZ4HLM7q2SamuKpq.ak3njtO', 'System Administrator', 1, '2025-11-28 04:09:33.83');
/*!40000 ALTER TABLE "users" ENABLE KEYS */;

DROP TABLE IF EXISTS "vehicles";
CREATE TABLE IF NOT EXISTS "vehicles" (
	"id" SERIAL NOT NULL,
	"plate" VARCHAR(50) NOT NULL,
	"type" VARCHAR(100) NULL DEFAULT NULL,
	"owner" VARCHAR(200) NULL DEFAULT NULL,
	PRIMARY KEY ("id"),
	UNIQUE INDEX "vehicles_plate_key" ("plate")
);

/*!40000 ALTER TABLE "vehicles" DISABLE KEYS */;
REPLACE INTO "vehicles" ("id", "plate", "type", "owner") VALUES
	(1, 'B1234AB', 'TRUCK', 'PT Transport Satu'),
	(2, 'B5678CD', 'TRUCK', 'CV Transport Dua'),
	(3, 'D9012EF', 'TRAILER', 'PT Transport Tiga');
/*!40000 ALTER TABLE "vehicles" ENABLE KEYS */;

DROP TABLE IF EXISTS "weighbridges";
CREATE TABLE IF NOT EXISTS "weighbridges" (
	"id" SERIAL NOT NULL,
	"name" VARCHAR(150) NOT NULL,
	"location" VARCHAR(200) NULL DEFAULT NULL,
	"indicator_topic" VARCHAR(200) NULL DEFAULT NULL,
	"config" JSONB NULL DEFAULT NULL,
	PRIMARY KEY ("id")
);

/*!40000 ALTER TABLE "weighbridges" DISABLE KEYS */;
REPLACE INTO "weighbridges" ("id", "name", "location", "indicator_topic", "config") VALUES
	(1, 'Weighbridge 1', 'Gate A', NULL, NULL),
	(2, 'Weighbridge 2', 'Gate B', NULL, NULL);
/*!40000 ALTER TABLE "weighbridges" ENABLE KEYS */;

DROP FUNCTION IF EXISTS "uuid_generate_v1";
DELIMITER //
CREATE FUNCTION "uuid_generate_v1"() RETURNS UUID AS $$ uuid_generate_v1 $$//
DELIMITER ;

DROP FUNCTION IF EXISTS "uuid_generate_v1mc";
DELIMITER //
CREATE FUNCTION "uuid_generate_v1mc"() RETURNS UUID AS $$ uuid_generate_v1mc $$//
DELIMITER ;

DROP FUNCTION IF EXISTS "uuid_generate_v3";
DELIMITER //
CREATE FUNCTION "uuid_generate_v3"(namespace UUID, name TEXT) RETURNS UUID AS $$ uuid_generate_v3 $$//
DELIMITER ;

DROP FUNCTION IF EXISTS "uuid_generate_v4";
DELIMITER //
CREATE FUNCTION "uuid_generate_v4"() RETURNS UUID AS $$ uuid_generate_v4 $$//
DELIMITER ;

DROP FUNCTION IF EXISTS "uuid_generate_v5";
DELIMITER //
CREATE FUNCTION "uuid_generate_v5"(namespace UUID, name TEXT) RETURNS UUID AS $$ uuid_generate_v5 $$//
DELIMITER ;

DROP FUNCTION IF EXISTS "uuid_nil";
DELIMITER //
CREATE FUNCTION "uuid_nil"() RETURNS UUID AS $$ uuid_nil $$//
DELIMITER ;

DROP FUNCTION IF EXISTS "uuid_ns_dns";
DELIMITER //
CREATE FUNCTION "uuid_ns_dns"() RETURNS UUID AS $$ uuid_ns_dns $$//
DELIMITER ;

DROP FUNCTION IF EXISTS "uuid_ns_oid";
DELIMITER //
CREATE FUNCTION "uuid_ns_oid"() RETURNS UUID AS $$ uuid_ns_oid $$//
DELIMITER ;

DROP FUNCTION IF EXISTS "uuid_ns_url";
DELIMITER //
CREATE FUNCTION "uuid_ns_url"() RETURNS UUID AS $$ uuid_ns_url $$//
DELIMITER ;

DROP FUNCTION IF EXISTS "uuid_ns_x500";
DELIMITER //
CREATE FUNCTION "uuid_ns_x500"() RETURNS UUID AS $$ uuid_ns_x500 $$//
DELIMITER ;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
