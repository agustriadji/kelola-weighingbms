-- WBMS Database Initialization Script
-- Skip problematic wbms_db.sql and create fresh database

-- Connect to wbms_db
\c wbms_db;

-- Create tables and insert sample data
-- \i /docker-entrypoint-initdb.d/create-tables.sql
\i /docker-entrypoint-initdb.d/wbms_db.sql