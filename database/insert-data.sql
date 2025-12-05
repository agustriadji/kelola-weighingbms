-- Insert sample data for WBMS
\c wbms_db;

-- Insert roles
INSERT INTO roles (name) VALUES 
  ('Admin'), ('Supervisor'), ('Operator'), ('Viewer')
ON CONFLICT (name) DO NOTHING;

-- Insert permissions
INSERT INTO permissions (name) VALUES 
  ('view_dashboard'), ('view_weighing'), ('create_weighing'), ('update_weighing'), 
  ('delete_weighing'), ('view_users'), ('create_users'), ('update_users'), 
  ('delete_users'), ('view_reports'), ('export_reports'), ('manage_system')
ON CONFLICT (name) DO NOTHING;

-- Insert role permissions
-- Admin gets all permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p WHERE r.name = 'Admin'
ON CONFLICT DO NOTHING;

-- Supervisor permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p 
WHERE r.name = 'Supervisor' AND p.name IN (
  'view_dashboard', 'view_weighing', 'create_weighing', 'update_weighing', 
  'view_users', 'view_reports', 'export_reports'
)
ON CONFLICT DO NOTHING;

-- Operator permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p 
WHERE r.name = 'Operator' AND p.name IN (
  'view_dashboard', 'view_weighing', 'create_weighing'
)
ON CONFLICT DO NOTHING;

-- Viewer permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p 
WHERE r.name = 'Viewer' AND p.name IN (
  'view_dashboard', 'view_weighing', 'view_reports'
)
ON CONFLICT DO NOTHING;

-- Insert default users (bcrypt hashed passwords)
INSERT INTO users (username, password_hash, full_name, role_id) VALUES 
  ('admin', '$2b$08$rGp8H.E8.q/4J8J8J8J8JOJ8J8J8J8J8J8J8J8J8J8J8J8J8J8J8J8', 'System Administrator', 1),
  ('supervisor', '$2b$08$rGp8H.E8.q/4J8J8J8J8JOJ8J8J8J8J8J8J8J8J8J8J8J8J8J8J8J8', 'Supervisor User', 2),
  ('operator', '$2b$08$rGp8H.E8.q/4J8J8J8J8JOJ8J8J8J8J8J8J8J8J8J8J8J8J8J8J8J8', 'Operator User', 3),
  ('viewer', '$2b$08$rGp8H.E8.q/4J8J8J8J8JOJ8J8J8J8J8J8J8J8J8J8J8J8J8J8J8J8', 'Viewer User', 4)
ON CONFLICT (username) DO NOTHING;

-- Insert sample suppliers
INSERT INTO suppliers (code, name) VALUES 
  ('SUP001', 'PT. Supplier One'),
  ('SUP002', 'PT. Supplier Two'),
  ('SUP003', 'CV. Supplier Three')
ON CONFLICT (code) DO NOTHING;

-- Insert sample materials
INSERT INTO materials (code, description, uom) VALUES 
  ('MAT001', 'Crude Palm Oil (CPO)', 'KG'),
  ('MAT002', 'Palm Kernel Oil (PKO)', 'KG'),
  ('MAT003', 'Palm Fatty Acid Distillate (PFAD)', 'KG')
ON CONFLICT DO NOTHING;

-- Insert sample vehicles
INSERT INTO vehicles (plate, type, owner) VALUES 
  ('BK1234ABC', 'Tank Truck', 'PT. Transport One'),
  ('BK5678DEF', 'Tank Truck', 'PT. Transport Two'),
  ('BK9012GHI', 'Box Truck', 'CV. Transport Three')
ON CONFLICT (plate) DO NOTHING;

-- Insert sample drivers
INSERT INTO drivers (name, sim) VALUES 
  ('Budi Santoso', '081234567890'),
  ('Andi Wijaya', '081234567891'),
  ('Candra Kusuma', '081234567892')
ON CONFLICT DO NOTHING;

-- Insert sample weighbridges
INSERT INTO weighbridges (name, location) VALUES 
  ('WB-001', 'Gate In'),
  ('WB-002', 'Gate Out'),
  ('WB-003', 'Internal Check')
ON CONFLICT DO NOTHING;

-- Reset sequences to avoid duplicate key errors
SELECT setval('batches_id_seq', COALESCE((SELECT MAX(id) FROM batches), 0) + 1, false);
SELECT setval('users_id_seq', COALESCE((SELECT MAX(id) FROM users), 0) + 1, false);
SELECT setval('roles_id_seq', COALESCE((SELECT MAX(id) FROM roles), 0) + 1, false);
SELECT setval('permissions_id_seq', COALESCE((SELECT MAX(id) FROM permissions), 0) + 1, false);
SELECT setval('suppliers_id_seq', COALESCE((SELECT MAX(id) FROM suppliers), 0) + 1, false);
SELECT setval('materials_id_seq', COALESCE((SELECT MAX(id) FROM materials), 0) + 1, false);
SELECT setval('vehicles_id_seq', COALESCE((SELECT MAX(id) FROM vehicles), 0) + 1, false);
SELECT setval('drivers_id_seq', COALESCE((SELECT MAX(id) FROM drivers), 0) + 1, false);
SELECT setval('weighbridges_id_seq', COALESCE((SELECT MAX(id) FROM weighbridges), 0) + 1, false);