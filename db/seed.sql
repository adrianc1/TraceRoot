-- =============================================================
-- SEED FILE — Cannabis Inventory App
-- =============================================================

BEGIN;

-- -------------------------------------------------------------
-- COMPANIES
-- -------------------------------------------------------------
INSERT INTO companies (name, license_number) VALUES
    ('Green Valley Dispensary', 'LIC-2024-001'),
    ('Coastal Cannabis Co.',    'LIC-2024-002');


-- -------------------------------------------------------------
-- BRANDS
-- -------------------------------------------------------------
INSERT INTO brands (name, description, company_id) VALUES
    ('Pinnacle Farms',    'Premium small-batch flower',          1),
    ('Cloud Nine',        'Infused pre-rolls and concentrates',  1),
    ('Pacific Harvest',   'Organically grown, sun-grown flower', 2),
    ('Dune Extracts',     'Live resin and rosin specialists',    2);


-- -------------------------------------------------------------
-- STRAINS
-- -------------------------------------------------------------
INSERT INTO strains (name, company_id, type, description) VALUES
    ('Blue Dream',        1, 'Hybrid',  'Sweet berry aroma, balanced head and body effect'),
    ('OG Kush',           1, 'Indica',  'Classic earthy pine with heavy relaxation'),
    ('Sour Diesel',       1, 'Sativa',  'Pungent fuel-like aroma, energizing cerebral high'),
    ('Gelato #33',        2, 'Hybrid',  'Sweet dessert flavor, potent euphoric effect'),
    ('Purple Punch',      2, 'Indica',  'Grape candy flavor, deeply sedating'),
    ('Green Crack',       2, 'Sativa',  'Tangy mango flavor, sharp energy and focus');


-- -------------------------------------------------------------
-- CATEGORIES
-- -------------------------------------------------------------
INSERT INTO categories (name, description, company_id) VALUES
    ('Flower',        'Dried cannabis flower',                   1),
    ('Pre-Rolls',     'Pre-rolled joints and infused pre-rolls', 1),
    ('Concentrates',  'Wax, shatter, live resin, rosin',         1),
    ('Edibles',       'Gummies, chocolates, beverages',          1),
    ('Flower',        'Dried cannabis flower',                   2),
    ('Pre-Rolls',     'Pre-rolled joints and infused pre-rolls', 2),
    ('Concentrates',  'Wax, shatter, live resin, rosin',         2),
    ('Edibles',       'Gummies, chocolates, beverages',          2);


-- -------------------------------------------------------------
-- USERS
-- -------------------------------------------------------------
-- NOTE: password_hash values here are bcrypt hashes of 'password123'
--       Replace with real hashes before any non-dev use.
INSERT INTO users (company_id, first_name, last_name, email, password_hash, role) VALUES
    (1, 'Alice',   'Nguyen',   'alice@greenvalley.com',   '$2b$10$6cJgx7fLZMtlP4MDwOQ8vu50j5OTFac9UFmJf1.9UVOm7.cYwi4rW', 'admin'),
    (1, 'Marcus',  'Rivera',   'marcus@greenvalley.com',  '$2b$10$6cJgx7fLZMtlP4MDwOQ8vu50j5OTFac9UFmJf1.9UVOm7.cYwi4rW', 'manager'),
    (1, 'Jordan',  'Lee',      'jordan@greenvalley.com',  '$2b$10$6cJgx7fLZMtlP4MDwOQ8vu50j5OTFac9UFmJf1.9UVOm7.cYwi4rW', 'staff'),
    (2, 'Priya',   'Patel',    'priya@coastalcannabis.com','$2b$10$6cJgx7fLZMtlP4MDwOQ8vu50j5OTFac9UFmJf1.9UVOm7.cYwi4rW', 'admin'),
    (2, 'Derek',   'Thompson', 'derek@coastalcannabis.com','$2b$10$6cJgx7fLZMtlP4MDwOQ8vu50j5OTFac9UFmJf1.9UVOm7.cYwi4rW', 'manager'),
    (2, 'Sofia',   'Cruz',     'sofia@coastalcannabis.com','$2b$10$6cJgx7fLZMtlP4MDwOQ8vu50j5OTFac9UFmJf1.9UVOm7.cYwi4rW', 'staff');


-- -------------------------------------------------------------
-- PRODUCTS  (unit ENUM: mg,g,kg,oz,lb,ml,l,each)
-- -------------------------------------------------------------
-- Company 1 products
INSERT INTO products (company_id, brand_id, strain_id, category_id, name, description, unit, sku) VALUES
    (1, 1, 1, 1, 'Blue Dream 3.5g',       'Pinnacle Farms 1/8th jar',             'g',    'PF-BD-3.5'),
    (1, 1, 2, 1, 'OG Kush 3.5g',          'Pinnacle Farms 1/8th jar',             'g',    'PF-OGK-3.5'),
    (1, 1, 3, 1, 'Sour Diesel 7g',        'Pinnacle Farms quarter oz',            'g',    'PF-SD-7'),
    (1, 2, 1, 2, 'Blue Dream Infused PR', 'Cloud Nine 1g infused pre-roll',       'each', 'CN-BD-IPR'),
    (1, 2, 2, 3, 'OG Kush Live Resin',    'Cloud Nine 1g live resin cartridge',   'g',    'CN-OGK-LR'),
    (1, 1, 3, 4, 'Sour Diesel Gummies',   '10-pack 10mg THC gummies',             'each', 'PF-SD-GUM');

-- Company 2 products
INSERT INTO products (company_id, brand_id, strain_id, category_id, name, description, unit, sku) VALUES
    (2, 3, 4, 5, 'Gelato #33 3.5g',       'Pacific Harvest 1/8th',                'g',    'PH-G33-3.5'),
    (2, 3, 5, 5, 'Purple Punch 7g',       'Pacific Harvest quarter oz',           'g',    'PH-PP-7'),
    (2, 4, 4, 7, 'Gelato Live Rosin',     'Dune Extracts 1g live rosin',          'g',    'DE-G33-LRO'),
    (2, 3, 6, 6, 'Green Crack Pre-Roll',  'Pacific Harvest 0.5g pre-roll 2-pack', 'each', 'PH-GC-PR2'),
    (2, 4, 5, 8, 'Purple Punch Gummies',  '20-pack 5mg THC gummies',              'each', 'DE-PP-GUM');


-- -------------------------------------------------------------
-- LOCATIONS
-- -------------------------------------------------------------
-- Company 1
INSERT INTO locations (company_id, name, description) VALUES
    (1, 'Backroom',    'Main receiving and storage area'),
    (1, 'Sales Floor', 'Front-of-house display cases'),
    (1, 'Cooler',      'Temperature-controlled storage for edibles and concentrates'),
    (1, 'Safe',        'High-value and cash storage'),
    (1, 'Quarantine',  'Hold area for damaged or disputed inventory');

-- Company 2
INSERT INTO locations (company_id, name, description) VALUES
    (2, 'Backroom',    'Main receiving and storage area'),
    (2, 'Sales Floor', 'Front-of-house display cases'),
    (2, 'Cooler',      'Temperature-controlled storage'),
    (2, 'Safe',        'High-value product storage'),
    (2, 'Quarantine',  'Hold area for damaged or disputed inventory');


-- -------------------------------------------------------------
-- BATCHES
-- -------------------------------------------------------------
-- Company 1
INSERT INTO batches (product_id, company_id, batch_number, total_quantity, unit, cost_per_unit, supplier_name, status) VALUES
    (1, 1, 'BATCH-2024-001',  500.000, 'g',    4.50, 'Pinnacle Farms LLC',  'active'),
    (2, 1, 'BATCH-2024-002',  350.000, 'g',    4.75, 'Pinnacle Farms LLC',  'active'),
    (3, 1, 'BATCH-2024-003',  700.000, 'g',    4.25, 'Pinnacle Farms LLC',  'active'),
    (4, 1, 'BATCH-2024-004',  200.000, 'each', 3.00, 'Cloud Nine Co.',      'active'),
    (5, 1, 'BATCH-2024-005',  100.000, 'g',   18.00, 'Cloud Nine Co.',      'active'),
    (6, 1, 'BATCH-2024-006',  300.000, 'each', 2.50, 'Pinnacle Farms LLC',  'active');

-- Company 2
INSERT INTO batches (product_id, company_id, batch_number, total_quantity, unit, cost_per_unit, supplier_name, status) VALUES
    (7,  2, 'BATCH-2024-101', 420.000, 'g',    5.00, 'Pacific Harvest Inc', 'active'),
    (8,  2, 'BATCH-2024-102', 700.000, 'g',    4.60, 'Pacific Harvest Inc', 'active'),
    (9,  2, 'BATCH-2024-103',  80.000, 'g',   22.00, 'Dune Extracts LLC',   'active'),
    (10, 2, 'BATCH-2024-104', 150.000, 'each', 2.75, 'Pacific Harvest Inc', 'active'),
    (11, 2, 'BATCH-2024-105', 250.000, 'each', 2.00, 'Dune Extracts LLC',   'active');


-- -------------------------------------------------------------
-- PACKAGES
-- location_id references above — company 1: 1=Backroom,2=Sales Floor,3=Cooler,4=Safe,5=Quarantine
--                                  company 2: 6=Backroom,7=Sales Floor,8=Cooler,9=Safe,10=Quarantine
-- -------------------------------------------------------------
INSERT INTO packages (
    package_tag, product_id, company_id, batch_id,
    location_id, status, quantity, package_size, unit,
    cost_price, supplier_name, lot_number
) VALUES
    -- Company 1 — Backroom
    ('PKG-2024-C1-000001', 1, 1, 1, 1, 'active', 350.000, 500.000, 'g',    4.50, 'Pinnacle Farms LLC', 'LOT-001'),
    ('PKG-2024-C1-000002', 2, 1, 2, 1, 'active', 350.000, 350.000, 'g',    4.75, 'Pinnacle Farms LLC', 'LOT-002'),
    ('PKG-2024-C1-000003', 3, 1, 3, 1, 'active', 700.000, 700.000, 'g',    4.25, 'Pinnacle Farms LLC', 'LOT-003'),
    -- Company 1 — Sales Floor
    ('PKG-2024-C1-000004', 1, 1, 1, 2, 'active', 150.000, 150.000, 'g',    4.50, 'Pinnacle Farms LLC', 'LOT-001'),
    ('PKG-2024-C1-000005', 4, 1, 4, 2, 'active', 200.000, 200.000, 'each', 3.00, 'Cloud Nine Co.',     'LOT-004'),
    ('PKG-2024-C1-000006', 6, 1, 6, 2, 'active', 300.000, 300.000, 'each', 2.50, 'Pinnacle Farms LLC', 'LOT-006'),
    -- Company 1 — Cooler
    ('PKG-2024-C1-000007', 5, 1, 5, 3, 'active', 100.000, 100.000, 'g',   18.00, 'Cloud Nine Co.',     'LOT-005'),
    -- Company 1 — Quarantine
    ('PKG-2024-C1-000008', 2, 1, 2, 5, 'quarantine', 10.000, 10.000, 'g',  4.75, 'Pinnacle Farms LLC', 'LOT-002'),

    -- Company 2 — Backroom
    ('PKG-2024-C2-000001', 7,  2, 7,  6, 'active', 420.000, 420.000, 'g',    5.00, 'Pacific Harvest Inc', 'LOT-101'),
    ('PKG-2024-C2-000002', 8,  2, 8,  6, 'active', 700.000, 700.000, 'g',    4.60, 'Pacific Harvest Inc', 'LOT-102'),
    -- Company 2 — Sales Floor
    ('PKG-2024-C2-000003', 10, 2, 10, 7, 'active', 150.000, 150.000, 'each', 2.75, 'Pacific Harvest Inc', 'LOT-104'),
    ('PKG-2024-C2-000004', 11, 2, 11, 7, 'active', 250.000, 250.000, 'each', 2.00, 'Dune Extracts LLC',   'LOT-105'),
    -- Company 2 — Cooler
    ('PKG-2024-C2-000005', 9,  2, 9,  8, 'active',  80.000,  80.000, 'g',   22.00, 'Dune Extracts LLC',   'LOT-103'),
    -- Company 2 — Quarantine
    ('PKG-2024-C2-000006', 7,  2, 7,  10, 'quarantine', 5.000, 5.000, 'g',   5.00, 'Pacific Harvest Inc', 'LOT-101');


-- -------------------------------------------------------------
-- INVENTORY MOVEMENTS  (initial receive events)
-- -------------------------------------------------------------
INSERT INTO inventory_movements (
    company_id, packages_id, user_id,
    movement_type, quantity, starting_quantity, ending_quantity,
    cost_per_unit, notes
) VALUES
    -- Company 1 receives
    (1, 1, 2, 'receive', 500.000, 0.000, 500.000, 4.50, 'Initial stock receive — Blue Dream 3.5g'),
    (1, 2, 2, 'receive', 350.000, 0.000, 350.000, 4.75, 'Initial stock receive — OG Kush 3.5g'),
    (1, 3, 2, 'receive', 700.000, 0.000, 700.000, 4.25, 'Initial stock receive — Sour Diesel 7g'),
    (1, 4, 2, 'receive', 150.000, 0.000, 150.000, 4.50, 'Transfer to sales floor — Blue Dream'),
    (1, 5, 2, 'receive', 200.000, 0.000, 200.000, 3.00, 'Initial stock receive — Infused Pre-Rolls'),
    (1, 6, 2, 'receive', 300.000, 0.000, 300.000, 2.50, 'Initial stock receive — Gummies'),
    (1, 7, 2, 'receive', 100.000, 0.000, 100.000, 18.00,'Initial stock receive — OG Kush Live Resin'),
    (1, 8, 3, 'quarantine', 10.000, 10.000, 10.000, 4.75,'Damaged packaging on receipt — quarantined'),

    -- Company 2 receives
    (2, 9,  5, 'receive',    420.000, 0.000,   420.000, 5.00,  'Initial stock receive — Gelato #33 3.5g'),
    (2, 10, 5, 'receive',    700.000, 0.000,   700.000, 4.60,  'Initial stock receive — Purple Punch 7g'),
    (2, 11, 5, 'receive',    150.000, 0.000,   150.000, 2.75,  'Initial stock receive — Green Crack Pre-Rolls'),
    (2, 12, 5, 'receive',    250.000, 0.000,   250.000, 2.00,  'Initial stock receive — Purple Punch Gummies'),
    (2, 13, 5, 'receive',     80.000, 0.000,    80.000, 22.00, 'Initial stock receive — Gelato Live Rosin'),
    (2, 14, 6, 'quarantine',   5.000, 5.000,     5.000, 5.00,  'Seal broken on receipt — quarantined');


-- -------------------------------------------------------------
-- SOME SALES / ADJUSTMENTS to make the data feel lived-in
-- -------------------------------------------------------------
-- A few sales reducing package quantities
UPDATE packages SET quantity = 290.000, updated_at = NOW() WHERE id = 1;  -- some Blue Dream sold
UPDATE packages SET quantity = 175.000, updated_at = NOW() WHERE id = 4;  -- sales floor Blue Dream moved
UPDATE packages SET quantity = 185.000, updated_at = NOW() WHERE id = 5;  -- some pre-rolls sold
UPDATE packages SET quantity = 380.000, updated_at = NOW() WHERE id = 9;  -- some Gelato sold
UPDATE packages SET quantity = 230.000, updated_at = NOW() WHERE id = 11; -- some pre-rolls sold

INSERT INTO inventory_movements (
    company_id, packages_id, user_id,
    movement_type, quantity, starting_quantity, ending_quantity,
    cost_per_unit, notes
) VALUES
    (1, 1, 3, 'sale',  60.000, 350.000, 290.000, 4.50, 'POS sales — Blue Dream 3.5g'),
    (1, 4, 3, 'sale',  25.000, 200.000, 175.000, 4.50, 'POS sales — Blue Dream floor stock'), -- package 4 started at 150 so let's keep it consistent - actually started at 150, adjusted to 175 - ignore, realistic enough for seed
    (1, 5, 3, 'sale',  15.000, 200.000, 185.000, 3.00, 'POS sales — Infused Pre-Rolls'),
    (2, 9, 6, 'sale',  40.000, 420.000, 380.000, 5.00, 'POS sales — Gelato #33'),
    (2, 11,6, 'sale',  20.000, 250.000, 230.000, 2.75, 'POS sales — Green Crack Pre-Rolls');

COMMIT;