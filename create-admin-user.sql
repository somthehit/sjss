-- Run this SQL in your Supabase SQL Editor to create the admin user
-- Go to: https://supabase.com/dashboard/project/lkksusoesadodxhgnelt/sql/new

INSERT INTO admin_users (email, password_hash, name, role) 
VALUES ('admin@sjsss.edu.np', '$2b$10$Wp8LCYlN9pB6Q1TN79SkueF/TO.zBFbINz8i2dcwYMTMQYUuB.LHq', 'Admin', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Update existing admin user password if it already exists
UPDATE admin_users 
SET password_hash = '$2b$10$Wp8LCYlN9pB6Q1TN79SkueF/TO.zBFbINz8i2dcwYMTMQYUuB.LHq'
WHERE email = 'admin@sjsss.edu.np';

-- Verify the admin user was created
SELECT * FROM admin_users WHERE email = 'admin@sjsss.edu.np';
