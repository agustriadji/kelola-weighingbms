-- WBMS Database Initialization Script
-- This script will create database and import the exported wbms_db.sql

-- Create database if not exists (PostgreSQL will create it via POSTGRES_DB env var)
-- But we ensure it exists
SELECT 'CREATE DATABASE wbms_db' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'wbms_db')\gexec

-- Connect to wbms_db
\c wbms_db;

-- Import the exported database
\i /docker-entrypoint-initdb.d/wbms_db.sql