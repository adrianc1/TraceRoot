-- Drop + recreate everything
\i db/schema.sql

\i db/rls_setup.sql 

-- Insert dev data
\i db/seed.sql