DO $$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'tracy_ro') THEN
    CREATE ROLE tracy_ro LOGIN NOSUPERUSER NOBYPASSRLS;
  END IF;
END $$;

GRANT USAGE ON SCHEMA public TO tracy_ro;
GRANT SELECT ON packages, products, brands, categories, strains,
                 locations, batches, inventory_movements TO tracy_ro;

DROP POLICY IF EXISTS tenant_isolation ON packages;
DROP POLICY IF EXISTS tenant_isolation ON products;
DROP POLICY IF EXISTS tenant_isolation ON brands;
DROP POLICY IF EXISTS tenant_isolation ON categories;
DROP POLICY IF EXISTS tenant_isolation ON strains;
DROP POLICY IF EXISTS tenant_isolation ON locations;
DROP POLICY IF EXISTS tenant_isolation ON batches;
DROP POLICY IF EXISTS tenant_isolation ON inventory_movements;


-- RLS on packages 
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON packages
  USING (company_id = current_setting('app.company_id', true)::int);


-- RLS on products 
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON products
  USING (company_id = current_setting('app.company_id', true)::int);

-- RLS on brands 
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON brands
  USING (company_id = current_setting('app.company_id', true)::int);


-- RLS on categories 
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON categories
  USING (company_id = current_setting('app.company_id', true)::int);


  -- RLS on strains 
ALTER TABLE strains ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON strains
  USING (company_id = current_setting('app.company_id', true)::int);

    
-- RLS on locations 
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON locations
  USING (company_id = current_setting('app.company_id', true)::int);


-- RLS on batches
ALTER TABLE batches ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON batches
    USING (company_id = current_setting('app.company_id', true)::int);


-- RLS on inventory_movements
ALTER TABLE inventory_movements ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON inventory_movements 
    USING(company_id = current_setting('app.company_id', true)::int);
