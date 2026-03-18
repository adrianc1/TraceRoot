//  Demo credentials:
//  Email:    demo@traceroot.io
//  Password: demo123

require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('./pool');

async function seed() {
	const client = await pool.connect();

	try {
		await client.query('BEGIN');

		// cleanup any existing demo data

		await client.query(`
      DELETE FROM transfer_items
      WHERE transfer_id IN (
        SELECT t.id FROM transfers t
        JOIN companies c ON c.id = t.company_id
        WHERE c.name = 'TraceRoot Demo'
      )
    `);
		await client.query(`DELETE FROM companies WHERE name = 'TraceRoot Demo'`);

		// ------------------------------------------------------------------
		// Company
		// ------------------------------------------------------------------
		const {
			rows: [company],
		} = await client.query(`
      INSERT INTO companies (name, license_number)
      VALUES ('TraceRoot Demo', 'C12-0000123-LIC')
      RETURNING id
    `);
		const cid = company.id;

		// ------------------------------------------------------------------
		// Users
		// ------------------------------------------------------------------
		const passwordHash = await bcrypt.hash('demo123', 10);

		const {
			rows: [adminUser],
		} = await client.query(
			`
      INSERT INTO users (company_id, first_name, last_name, email, password_hash, role)
      VALUES ($1, 'Demo', 'User', 'demo@traceroot.io', $2, 'admin')
      RETURNING id
    `,
			[cid, passwordHash],
		);
		const uid = adminUser.id;

		const {
			rows: [staff1],
		} = await client.query(
			`
      INSERT INTO users (company_id, first_name, last_name, email, password_hash, role)
      VALUES ($1, 'Jordan', 'Lee', 'jordan@demo.traceroot.io', $2, 'staff')
      RETURNING id
    `,
			[cid, passwordHash],
		);
		const staffId = staff1.id;

		const {
			rows: [manager1],
		} = await client.query(
			`
      INSERT INTO users (company_id, first_name, last_name, email, password_hash, role)
      VALUES ($1, 'Marcus', 'Rivera', 'marcus@demo.traceroot.io', $2, 'manager')
      RETURNING id
    `,
			[cid, passwordHash],
		);
		const managerId = manager1.id;

		// ------------------------------------------------------------------
		// Brands
		// ------------------------------------------------------------------
		const { rows: brands } = await client.query(
			`
      INSERT INTO brands (name, description, company_id) VALUES
        ('Pinnacle Farms', 'Premium small-batch indoor flower',       $1),
        ('Cloud Nine',     'Infused pre-rolls and concentrates',      $1),
        ('Sweet Relief',   'Artisan edibles and tinctures',           $1)
      RETURNING id
    `,
			[cid],
		);
		const [b1, b2, b3] = brands.map((r) => r.id);

		// ------------------------------------------------------------------
		// Strains
		// ------------------------------------------------------------------
		const { rows: strains } = await client.query(
			`
      INSERT INTO strains (name, company_id, type, description) VALUES
        ('Blue Dream',  $1, 'Hybrid', 'Sweet berry aroma, balanced head and body effect'),
        ('OG Kush',     $1, 'Indica', 'Classic earthy pine with heavy relaxation'),
        ('Sour Diesel', $1, 'Sativa', 'Pungent fuel-like aroma, energizing cerebral high'),
        ('Gelato #33',  $1, 'Hybrid', 'Sweet dessert flavor, potent euphoric effect'),
        ('Purple Punch',$1, 'Indica', 'Grape candy flavor, deeply sedating')
      RETURNING id
    `,
			[cid],
		);
		const [s1, s2, s3, s4, s5] = strains.map((r) => r.id);

		// ------------------------------------------------------------------
		// Categories
		// ------------------------------------------------------------------
		const { rows: cats } = await client.query(
			`
      INSERT INTO categories (name, description, company_id) VALUES
        ('Flower',       'Dried cannabis flower',                   $1),
        ('Pre-Rolls',    'Pre-rolled joints and infused pre-rolls', $1),
        ('Concentrates', 'Wax, shatter, live resin, rosin',         $1),
        ('Edibles',      'Gummies, chocolates, beverages',          $1)
      RETURNING id
    `,
			[cid],
		);
		const [c1, c2, c3, c4] = cats.map((r) => r.id);

		// ------------------------------------------------------------------
		// Locations
		// ------------------------------------------------------------------
		const { rows: locs } = await client.query(
			`
      INSERT INTO locations (company_id, name, description) VALUES
        ($1, 'Safe',       'High-value receiving and overnight storage'),
        ($1, 'Showroom',   'Front-of-house display cases'),
        ($1, 'Cooler',     'Temperature-controlled storage for edibles and concentrates'),
        ($1, 'Quarantine', 'Hold area for damaged or disputed inventory')
      RETURNING id
    `,
			[cid],
		);
		const [locSafe, locShow, locCool, locQuar] = locs.map((r) => r.id);

		// ------------------------------------------------------------------
		// Products
		// ------------------------------------------------------------------
		const { rows: prods } = await client.query(
			`
      INSERT INTO products (company_id, brand_id, strain_id, category_id, name, description, unit, sku) VALUES
        ($1, $2,  $3,  $4,  'Blue Dream 3.5g',         'Pinnacle Farms 1/8th jar',             'g',    'PF-BD-3.5'),
        ($1, $2,  $5,  $4,  'OG Kush 7g',              'Pinnacle Farms quarter oz',             'g',    'PF-OGK-7'),
        ($1, $6,  $7,  $8,  'Sour Diesel Pre-Roll',    'Cloud Nine 1g infused pre-roll',        'each', 'CN-SD-IPR'),
        ($1, $6,  $9,  $10, 'Gelato Live Resin 1g',    'Cloud Nine cold-cured live resin',      'g',    'CN-G33-LR'),
        ($1, $11, $3,  $12, 'Blue Dream Gummies 10mg', 'Sweet Relief 10-pack, 10mg THC each',   'each', 'SR-BD-GUM'),
        ($1, $11, $13, $12, 'Purple Punch Gummies 5mg','Sweet Relief 20-pack, 5mg THC each',    'each', 'SR-PP-GUM')
      RETURNING id
    `,
			[cid, b1, s1, c1, s2, b2, s3, c2, s4, c3, b3, c4, s5],
		);
		const [p1, p2, p3, p4, p5, p6] = prods.map((r) => r.id);

		// ------------------------------------------------------------------
		// Batches
		// ------------------------------------------------------------------
		const { rows: batches } = await client.query(
			`
      INSERT INTO batches (product_id, company_id, batch_number, total_quantity, unit, cost_per_unit, supplier_name, status) VALUES
        ($1,  $7, 'BATCH-2024-001', 1050.000, 'g',    4.50, 'Pinnacle Farms LLC', 'active'),
        ($2,  $7, 'BATCH-2024-002',  980.000, 'g',    4.75, 'Pinnacle Farms LLC', 'active'),
        ($3,  $7, 'BATCH-2024-003',  400.000, 'each', 3.00, 'Cloud Nine Co.',     'active'),
        ($4,  $7, 'BATCH-2024-004',   80.000, 'g',   18.00, 'Cloud Nine Co.',     'active'),
        ($5,  $7, 'BATCH-2024-005',  600.000, 'each', 2.50, 'Sweet Relief Inc.',  'active'),
        ($6,  $7, 'BATCH-2024-006',  500.000, 'each', 2.00, 'Sweet Relief Inc.',  'active')
      RETURNING id
    `,
			[p1, p2, p3, p4, p5, p6, cid],
		);
		const [bt1, bt2, bt3, bt4, bt5, bt6] = batches.map((r) => r.id);

		// ------------------------------------------------------------------
		// Packages — 17 total across 4 locations
		//
		// Safe (6):       pk1 BD, pk2 OGK, pk3 SD-PR, pk4 Gelato(LOCKED), pk5 BD-Gum, pk6 PP-Gum
		// Showroom (7):   pk7 BD, pk8 OGK, pk9 SD-PR, pk10 BD-Gum, pk11 PP-Gum, pk12 Gelato, pk13 OGK(second)
		// Cooler (2):     pk14 BD-Gum overflow, pk15 PP-Gum overflow
		// Quarantine (2): pk16 OGK damaged, pk17 BD damaged
		// ------------------------------------------------------------------
		const { rows: pkgs } = await client.query(
			`
      INSERT INTO packages (
        package_tag, product_id, company_id, batch_id,
        location_id, status, quantity, package_size, unit,
        cost_price, supplier_name, lot_number
      ) VALUES
        -- Safe
        ('DEMO-2024-000001', $1,  $7, $8,  $14, 'active',     420.000, 700.000, 'g',    4.50, 'Pinnacle Farms LLC', 'LOT-001'),
        ('DEMO-2024-000002', $2,  $7, $9,  $14, 'active',     350.000, 490.000, 'g',    4.75, 'Pinnacle Farms LLC', 'LOT-002'),
        ('DEMO-2024-000003', $3,  $7, $10, $14, 'active',     120.000, 200.000, 'each', 3.00, 'Cloud Nine Co.',     'LOT-003'),
        ('DEMO-2024-000004', $4,  $7, $11, $14, 'active',      50.000,  80.000, 'g',   18.00, 'Cloud Nine Co.',     'LOT-004'),
        ('DEMO-2024-000005', $5,  $7, $12, $14, 'active',     300.000, 300.000, 'each', 2.50, 'Sweet Relief Inc.',  'LOT-005'),
        ('DEMO-2024-000006', $6,  $7, $13, $14, 'active',     250.000, 250.000, 'each', 2.00, 'Sweet Relief Inc.',  'LOT-006'),
        -- Showroom
        ('DEMO-2024-000007', $1,  $7, $8,  $15, 'active',     175.000, 245.000, 'g',    4.50, 'Pinnacle Farms LLC', 'LOT-001'),
        ('DEMO-2024-000008', $2,  $7, $9,  $15, 'active',     130.000, 140.000, 'g',    4.75, 'Pinnacle Farms LLC', 'LOT-002'),
        ('DEMO-2024-000009', $3,  $7, $10, $15, 'active',     160.000, 200.000, 'each', 3.00, 'Cloud Nine Co.',     'LOT-003'),
        ('DEMO-2024-000010', $5,  $7, $12, $15, 'active',     230.000, 300.000, 'each', 2.50, 'Sweet Relief Inc.',  'LOT-005'),
        ('DEMO-2024-000011', $6,  $7, $13, $15, 'active',     215.000, 250.000, 'each', 2.00, 'Sweet Relief Inc.',  'LOT-006'),
        ('DEMO-2024-000012', $4,  $7, $11, $15, 'active',      22.000,  30.000, 'g',   18.00, 'Cloud Nine Co.',     'LOT-004'),
        ('DEMO-2024-000013', $2,  $7, $9,  $15, 'active',     350.000, 350.000, 'g',    4.75, 'Pinnacle Farms LLC', 'LOT-002'),
        -- Cooler
        ('DEMO-2024-000014', $5,  $7, $12, $16, 'active',      45.000,  50.000, 'each', 2.50, 'Sweet Relief Inc.',  'LOT-005'),
        ('DEMO-2024-000015', $6,  $7, $13, $16, 'active',      30.000,  30.000, 'each', 2.00, 'Sweet Relief Inc.',  'LOT-006'),
        -- Quarantine
        ('DEMO-2024-000016', $2,  $7, $9,  $17, 'quarantine',  15.000,  15.000, 'g',    4.75, 'Pinnacle Farms LLC', 'LOT-002'),
        ('DEMO-2024-000017', $1,  $7, $8,  $17, 'quarantine',   8.000,   8.000, 'g',    4.50, 'Pinnacle Farms LLC', 'LOT-001'),
        -- Inactive (depleted lot + discontinued SKU)
        ('DEMO-2024-000018', $2,  $7, $9,  $14, 'inactive',     0.000, 140.000, 'g',    4.75, 'Pinnacle Farms LLC', 'LOT-002'),
        ('DEMO-2024-000019', $3,  $7, $10, $15, 'inactive',     0.000, 100.000, 'each', 3.00, 'Cloud Nine Co.',     'LOT-003'),
        -- Reserved (held for wholesale order)
        ('DEMO-2024-000020', $4,  $7, $11, $14, 'reserved',    20.000,  20.000, 'g',   18.00, 'Cloud Nine Co.',     'LOT-004')
      RETURNING id
    `,
			[
				p1,
				p2,
				p3,
				p4,
				p5,
				p6,
				cid,
				bt1,
				bt2,
				bt3,
				bt4,
				bt5,
				bt6,
				locSafe,
				locShow,
				locCool,
				locQuar,
			],
		);

		const [
			pk1,
			pk2,
			pk3,
			pk4,
			pk5,
			pk6,
			pk7,
			pk8,
			pk9,
			pk10,
			pk11,
			pk12,
			pk13,
			pk14,
			pk15,
			pk16,
			pk17,
			pk18,
			pk19,
			pk20,
		] = pkgs.map((r) => r.id);

		// ------------------------------------------------------------------
		// Initial receive movements (all packages start with a receive)
		// ------------------------------------------------------------------
		await client.query(
			`
      INSERT INTO inventory_movements (
        company_id, packages_id, user_id, movement_type,
        quantity, starting_quantity, ending_quantity, cost_per_unit, notes, created_at
      ) VALUES
        ($1, $2,  $3, 'receive',    700.000, 0, 700.000, 4.50,  'Initial stock receive — Blue Dream 3.5g',         NOW() - INTERVAL '21 days'),
        ($1, $4,  $3, 'receive',    490.000, 0, 490.000, 4.75,  'Initial stock receive — OG Kush 7g',              NOW() - INTERVAL '21 days'),
        ($1, $5,  $3, 'receive',    200.000, 0, 200.000, 3.00,  'Initial stock receive — Sour Diesel Pre-Roll',    NOW() - INTERVAL '21 days'),
        ($1, $6,  $3, 'receive',     80.000, 0,  80.000, 18.00, 'Initial stock receive — Gelato Live Resin',       NOW() - INTERVAL '21 days'),
        ($1, $7,  $3, 'receive',    300.000, 0, 300.000, 2.50,  'Initial stock receive — Blue Dream Gummies',      NOW() - INTERVAL '21 days'),
        ($1, $8,  $3, 'receive',    250.000, 0, 250.000, 2.00,  'Initial stock receive — Purple Punch Gummies',    NOW() - INTERVAL '21 days'),
        ($1, $9,  $3, 'receive',    245.000, 0, 245.000, 4.50,  'Showroom receive — Blue Dream 3.5g',              NOW() - INTERVAL '20 days'),
        ($1, $10, $3, 'receive',    140.000, 0, 140.000, 4.75,  'Showroom receive — OG Kush 7g',                   NOW() - INTERVAL '20 days'),
        ($1, $11, $3, 'receive',    200.000, 0, 200.000, 3.00,  'Showroom receive — Sour Diesel Pre-Roll',         NOW() - INTERVAL '20 days'),
        ($1, $12, $3, 'receive',    300.000, 0, 300.000, 2.50,  'Showroom receive — Blue Dream Gummies',           NOW() - INTERVAL '20 days'),
        ($1, $13, $3, 'receive',    250.000, 0, 250.000, 2.00,  'Showroom receive — Purple Punch Gummies',         NOW() - INTERVAL '20 days'),
        ($1, $14, $3, 'receive',     30.000, 0,  30.000, 18.00, 'Showroom receive — Gelato Live Resin',            NOW() - INTERVAL '20 days'),
        ($1, $15, $3, 'receive',    350.000, 0, 350.000, 4.75,  'Showroom receive — OG Kush 7g (second batch)',    NOW() - INTERVAL '14 days'),
        ($1, $16, $3, 'receive',     50.000, 0,  50.000, 2.50,  'Cooler overflow — Blue Dream Gummies',            NOW() - INTERVAL '19 days'),
        ($1, $17, $3, 'receive',     30.000, 0,  30.000, 2.00,  'Cooler overflow — Purple Punch Gummies',          NOW() - INTERVAL '19 days'),
        ($1, $18, $3, 'quarantine',  15.000, 0,  15.000, 4.75,  'Damaged packaging on receipt — quarantined',      NOW() - INTERVAL '21 days'),
        ($1, $19, $3, 'quarantine',   8.000, 0,   8.000, 4.50,  'Seal broken on receipt — quarantined',            NOW() - INTERVAL '18 days')
    `,
			[
				cid,
				pk1,
				uid,
				pk2,
				pk3,
				pk4,
				pk5,
				pk6,
				pk7,
				pk8,
				pk9,
				pk10,
				pk11,
				pk12,
				pk13,
				pk14,
				pk15,
				pk16,
				pk17,
			],
		);

		// Movements for inactive + reserved packages
		await client.query(
			`
      INSERT INTO inventory_movements (
        company_id, packages_id, user_id, movement_type,
        quantity, starting_quantity, ending_quantity, cost_per_unit, notes, created_at
      ) VALUES
        ($1, $2, $3, 'receive',    140.000,   0.000, 140.000, 4.75, 'Initial stock receive — OG Kush 7g (now depleted)',         NOW() - INTERVAL '30 days'),
        ($1, $2, $3, 'sale',      -140.000, 140.000,   0.000, 4.75, 'POS sales — lot fully sold through',                        NOW() - INTERVAL '10 days'),
        ($1, $2, $3, 'adjustment',   0.000,   0.000,   0.000, NULL, 'Package deactivated — lot depleted',                        NOW() - INTERVAL '10 days'),
        ($1, $4, $3, 'receive',    100.000,   0.000, 100.000, 3.00, 'Initial stock receive — Sour Diesel Pre-Roll (discontinued)',NOW() - INTERVAL '28 days'),
        ($1, $4, $3, 'sale',      -100.000, 100.000,   0.000, 3.00, 'POS sales — SKU sold through, line discontinued',           NOW() - INTERVAL '6 days'),
        ($1, $4, $3, 'adjustment',   0.000,   0.000,   0.000, NULL, 'Package deactivated — SKU discontinued',                    NOW() - INTERVAL '6 days'),
        ($1, $5, $3, 'receive',     20.000,   0.000,  20.000, 18.00,'Initial stock receive — Gelato Live Resin (wholesale hold)', NOW() - INTERVAL '5 days'),
        ($1, $5, $3, 'adjustment',   0.000,  20.000,  20.000, NULL, 'Package reserved — held for wholesale order #4490',         NOW() - INTERVAL '5 days')
    `,
			[cid, pk18, uid, pk19, pk20],
		);

		// ------------------------------------------------------------------
		// Transfer 1 — CONFIRMED internal: Safe → Showroom (Blue Dream + OG Kush)
		// Created 18 days ago, confirmed same day
		// ------------------------------------------------------------------
		const {
			rows: [t1],
		} = await client.query(
			`
      INSERT INTO transfers (company_id, transfer_type, from_location_id, to_location_id,
        status, notes, created_by, confirmed_at, created_at)
      VALUES ($1, 'internal', $2, $3, 'confirmed',
        'Initial showroom stock — Blue Dream and OG Kush', $4,
        NOW() - INTERVAL '18 days', NOW() - INTERVAL '18 days')
      RETURNING id
    `,
			[cid, locSafe, locShow, uid],
		);

		await client.query(
			`
      INSERT INTO transfer_items (transfer_id, package_id, quantity) VALUES
        ($1, $2, 245.000),
        ($1, $3, 140.000)
    `,
			[t1.id, pk7, pk8],
		);

		await client.query(
			`
      INSERT INTO inventory_movements (company_id, packages_id, user_id, movement_type,
        quantity, starting_quantity, ending_quantity, notes, created_at) VALUES
        ($1, $2, $3, 'transfer_out', -245.000, 700.000, 455.000, 'Transfer out — Safe → Showroom (T#' || $4 || ')', NOW() - INTERVAL '18 days'),
        ($1, $5, $3, 'transfer_out', -140.000, 490.000, 350.000, 'Transfer out — Safe → Showroom (T#' || $4 || ')', NOW() - INTERVAL '18 days'),
        ($1, $2, $3, 'transfer_in',   245.000,   0.000, 245.000, 'Transfer in  — Safe → Showroom (T#' || $4 || ')', NOW() - INTERVAL '18 days'),
        ($1, $5, $3, 'transfer_in',   140.000,   0.000, 140.000, 'Transfer in  — Safe → Showroom (T#' || $4 || ')', NOW() - INTERVAL '18 days')
    `,
			[cid, pk1, uid, t1.id, pk2],
		);

		// ------------------------------------------------------------------
		// Transfer 2 — CONFIRMED internal: Safe → Showroom (Sour Diesel PR + Gummies)
		// Created 15 days ago
		// ------------------------------------------------------------------
		const {
			rows: [t2],
		} = await client.query(
			`
      INSERT INTO transfers (company_id, transfer_type, from_location_id, to_location_id,
        status, notes, created_by, confirmed_at, created_at)
      VALUES ($1, 'internal', $2, $3, 'confirmed',
        'Restocking showroom — Sour Diesel and gummies', $4,
        NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days')
      RETURNING id
    `,
			[cid, locSafe, locShow, managerId],
		);

		await client.query(
			`
      INSERT INTO transfer_items (transfer_id, package_id, quantity) VALUES
        ($1, $2, 200.000),
        ($1, $3, 300.000),
        ($1, $4, 250.000)
    `,
			[t2.id, pk9, pk10, pk11],
		);

		await client.query(
			`
      INSERT INTO inventory_movements (company_id, packages_id, user_id, movement_type,
        quantity, starting_quantity, ending_quantity, notes, created_at) VALUES
        ($1, $2, $3, 'transfer_out', -200.000, 200.000,   0.000, 'Transfer out — Safe → Showroom (T#' || $4 || ')', NOW() - INTERVAL '15 days'),
        ($1, $5, $3, 'transfer_out', -300.000, 300.000,   0.000, 'Transfer out — Safe → Showroom (T#' || $4 || ')', NOW() - INTERVAL '15 days'),
        ($1, $6, $3, 'transfer_out', -250.000, 250.000,   0.000, 'Transfer out — Safe → Showroom (T#' || $4 || ')', NOW() - INTERVAL '15 days'),
        ($1, $2, $3, 'transfer_in',   200.000,   0.000, 200.000, 'Transfer in  — Safe → Showroom (T#' || $4 || ')', NOW() - INTERVAL '15 days'),
        ($1, $5, $3, 'transfer_in',   300.000,   0.000, 300.000, 'Transfer in  — Safe → Showroom (T#' || $4 || ')', NOW() - INTERVAL '15 days'),
        ($1, $6, $3, 'transfer_in',   250.000,   0.000, 250.000, 'Transfer in  — Safe → Showroom (T#' || $4 || ')', NOW() - INTERVAL '15 days')
    `,
			[cid, pk3, uid, t2.id, pk5, pk6],
		);

		// ------------------------------------------------------------------
		// Transfer 3 — CONFIRMED internal: Safe → Cooler (gummies overflow)
		// Created 14 days ago
		// ------------------------------------------------------------------
		const {
			rows: [t3],
		} = await client.query(
			`
      INSERT INTO transfers (company_id, transfer_type, from_location_id, to_location_id,
        status, notes, created_by, confirmed_at, created_at)
      VALUES ($1, 'internal', $2, $3, 'confirmed',
        'Overflow to cooler — gummies require temp-controlled storage', $4,
        NOW() - INTERVAL '14 days', NOW() - INTERVAL '14 days')
      RETURNING id
    `,
			[cid, locSafe, locCool, uid],
		);

		await client.query(
			`
      INSERT INTO transfer_items (transfer_id, package_id, quantity) VALUES
        ($1, $2, 50.000),
        ($1, $3, 30.000)
    `,
			[t3.id, pk14, pk15],
		);

		await client.query(
			`
      INSERT INTO inventory_movements (company_id, packages_id, user_id, movement_type,
        quantity, starting_quantity, ending_quantity, notes, created_at) VALUES
        ($1, $2, $3, 'transfer_out', -50.000, 300.000, 250.000, 'Transfer out — Safe → Cooler (T#' || $4 || ')', NOW() - INTERVAL '14 days'),
        ($1, $5, $3, 'transfer_out', -30.000, 250.000, 220.000, 'Transfer out — Safe → Cooler (T#' || $4 || ')', NOW() - INTERVAL '14 days'),
        ($1, $2, $3, 'transfer_in',   50.000,   0.000,  50.000, 'Transfer in  — Safe → Cooler (T#' || $4 || ')', NOW() - INTERVAL '14 days'),
        ($1, $5, $3, 'transfer_in',   30.000,   0.000,  30.000, 'Transfer in  — Safe → Cooler (T#' || $4 || ')', NOW() - INTERVAL '14 days')
    `,
			[cid, pk5, uid, t3.id, pk6],
		);

		// ------------------------------------------------------------------
		// Transfer 4 — CONFIRMED internal: Safe → Showroom (OG Kush second batch)
		// Created 10 days ago
		// ------------------------------------------------------------------
		const {
			rows: [t4],
		} = await client.query(
			`
      INSERT INTO transfers (company_id, transfer_type, from_location_id, to_location_id,
        status, notes, created_by, confirmed_at, created_at)
      VALUES ($1, 'internal', $2, $3, 'confirmed',
        'OG Kush restock — showroom running low', $4,
        NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days')
      RETURNING id
    `,
			[cid, locSafe, locShow, managerId],
		);

		await client.query(
			`
      INSERT INTO transfer_items (transfer_id, package_id, quantity)
      VALUES ($1, $2, 350.000)
    `,
			[t4.id, pk13],
		);

		await client.query(
			`
      INSERT INTO inventory_movements (company_id, packages_id, user_id, movement_type,
        quantity, starting_quantity, ending_quantity, notes, created_at) VALUES
        ($1, $2, $3, 'transfer_out', -350.000, 490.000, 140.000, 'Transfer out — Safe → Showroom (T#' || $4 || ')', NOW() - INTERVAL '10 days'),
        ($1, $2, $3, 'transfer_in',   350.000,   0.000, 350.000, 'Transfer in  — Safe → Showroom (T#' || $4 || ')', NOW() - INTERVAL '10 days')
    `,
			[cid, pk2, uid, t4.id],
		);

		// ------------------------------------------------------------------
		// Transfer 5 — CANCELLED external: was going to ship Gelato to a retailer
		// Created 8 days ago, cancelled 7 days ago
		// ------------------------------------------------------------------
		const {
			rows: [t5],
		} = await client.query(
			`
      INSERT INTO transfers (company_id, transfer_type, from_location_id, to_company_name,
        status, notes, created_by, created_at)
      VALUES ($1, 'external', $2, 'Green Valley Retail LLC', 'cancelled',
        'Wholesale order cancelled — buyer backed out before confirmation', $3,
        NOW() - INTERVAL '8 days')
      RETURNING id
    `,
			[cid, locSafe, uid],
		);

		await client.query(
			`
      INSERT INTO transfer_items (transfer_id, package_id, quantity)
      VALUES ($1, $2, 30.000)
    `,
			[t5.id, pk4],
		);

		// Gelato was briefly locked, now unlocked after cancellation
		// (no movement written, package is back to normal)

		// ------------------------------------------------------------------
		// Transfer 6 — PENDING external: Gelato Live Resin to Pacific Coast Retail
		// Created 3 days ago — package is LOCKED
		// ------------------------------------------------------------------
		const {
			rows: [t6],
		} = await client.query(
			`
      INSERT INTO transfers (company_id, transfer_type, from_location_id, to_company_name,
        status, notes, created_by, created_at)
      VALUES ($1, 'external', $2, 'Pacific Coast Retail LLC', 'pending',
        'Wholesale order #4482 — Gelato Live Resin 1g', $3,
        NOW() - INTERVAL '3 days')
      RETURNING id
    `,
			[cid, locSafe, uid],
		);

		await client.query(
			`
      INSERT INTO transfer_items (transfer_id, package_id, quantity)
      VALUES ($1, $2, 50.000)
    `,
			[t6.id, pk4],
		);

		await client.query(
			`UPDATE packages SET locked = TRUE, updated_at = NOW() WHERE id = $1`,
			[pk4],
		);

		// ------------------------------------------------------------------
		// Transfer 7 — PENDING internal: Safe → Showroom (restocking run today)
		// ------------------------------------------------------------------
		const {
			rows: [t7],
		} = await client.query(
			`
      INSERT INTO transfers (company_id, transfer_type, from_location_id, to_location_id,
        status, notes, created_by, created_at)
      VALUES ($1, 'internal', $2, $3, 'pending',
        'Daily showroom restock — Blue Dream and Sour Diesel PR', $4,
        NOW() - INTERVAL '2 hours')
      RETURNING id
    `,
			[cid, locSafe, locShow, managerId],
		);

		await client.query(
			`
      INSERT INTO transfer_items (transfer_id, package_id, quantity) VALUES
        ($1, $2, 100.000),
        ($1, $3, 80.000)
    `,
			[t7.id, pk1, pk3],
		);

		await client.query(
			`UPDATE packages SET locked = TRUE, updated_at = NOW() WHERE id IN ($1, $2)`,
			[pk1, pk3],
		);

		// ------------------------------------------------------------------
		// Sales adjustments — lived-in POS activity over the past 2 weeks
		// ------------------------------------------------------------------
		const sales = [
			// [pkg_id, delta, start, end, notes, interval]
			[pk7, -70, 245, 175, 'POS sales — Blue Dream 3.5g', '17 days'],
			[pk8, -10, 140, 130, 'POS sales — OG Kush 7g', '16 days'],
			[pk9, -40, 200, 160, 'POS sales — Sour Diesel Pre-Roll', '14 days'],
			[pk10, -70, 300, 230, 'POS sales — Blue Dream Gummies', '13 days'],
			[pk11, -35, 250, 215, 'POS sales — Purple Punch Gummies', '12 days'],
			[pk12, -8, 30, 22, 'POS sales — Gelato Live Resin', '11 days'],
			[pk13, -0, 350, 350, null, null], // no sales on second OG Kush batch yet
			[pk14, -5, 50, 45, 'POS sales — Blue Dream Gummies (cooler)', '9 days'],
			[pk15, 0, 30, 30, null, null],
		].filter(([, , , , notes]) => notes !== null);

		for (const [pkgId, delta, start, end, notes, interval] of sales) {
			await client.query(
				`UPDATE packages SET quantity = $1, updated_at = NOW() WHERE id = $2`,
				[end, pkgId],
			);
			await client.query(
				`
        INSERT INTO inventory_movements (company_id, packages_id, user_id, movement_type,
          quantity, starting_quantity, ending_quantity, notes, created_at)
        VALUES ($1, $2, $3, 'sale', $4, $5, $6, $7, NOW() - INTERVAL '${interval}')
      `,
				[cid, pkgId, staffId, delta, start, end, notes],
			);
		}

		// A manual adjustment on Safe Blue Dream (shrinkage count correction)
		await client.query(
			`UPDATE packages SET quantity = 420.000, updated_at = NOW() WHERE id = $1`,
			[pk1],
		);
		await client.query(
			`
      INSERT INTO inventory_movements (company_id, packages_id, user_id, movement_type,
        quantity, starting_quantity, ending_quantity, notes, created_at)
      VALUES ($1, $2, $3, 'adjustment', -35.000, 455.000, 420.000,
        'Physical count correction — shrinkage adjustment', NOW() - INTERVAL '5 days')
    `,
			[cid, pk1, managerId],
		);

		await client.query('COMMIT');

		console.log('');
		console.log('Demo seed complete.');
		console.log('');
		console.log('  Company:  TraceRoot Demo');
		console.log('  Email:    demo@traceroot.io');
		console.log('  Password: demo123');
		console.log('');
		console.log('  17 packages | 4 locations | 6 products');
		console.log(
			'  4 confirmed transfers | 1 cancelled | 1 pending external | 1 pending internal',
		);
		console.log('');
	} catch (err) {
		await client.query('ROLLBACK');
		console.error('Seed failed — rolled back.\n', err);
		process.exit(1);
	} finally {
		client.release();
		process.exit(0);
	}
}

seed();
