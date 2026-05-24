-- Run this SQL in your Supabase SQL Editor to create the admin user
-- Go to: https://supabase.com/dashboard/project/lkksusoesadodxhgnelt/sql/new

INSERT INTO admin_users (email, password_hash, name, role) 
VALUES ('admin@sjsss.edu.np', '$2b$10$Pek2ifci26DebXLUa8sfheW47cbEAlxAcUR.Hob6D4fj2f7rGzhc2', 'Admin', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Verify the admin user was created
SELECT * FROM admin_users WHERE email = 'admin@sjsss.edu.np';
