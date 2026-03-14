-- CLEAN SLATE
DROP TABLE IF EXISTS inventory_movements CASCADE;
DROP TABLE IF EXISTS packages CASCADE;
DROP TABLE IF EXISTS locations CASCADE; 
DROP TABLE IF EXISTS batches CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS brands CASCADE;
DROP TABLE IF EXISTS strains CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS companies CASCADE;

DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS inventory_status CASCADE;
DROP TYPE IF EXISTS unit CASCADE;

CREATE TYPE user_role AS ENUM ('admin', 'manager', 'staff');
CREATE TYPE product_status AS ENUM ('active', 'archived');
CREATE TYPE inventory_status AS ENUM ('active','inactive','quarantine','damaged','expired','reserved');
CREATE TYPE unit AS ENUM ('mg','g','kg','oz','lb','ml','l','each');


CREATE TABLE companies (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(255) NOT NULL UNIQUE,
    license_number VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE brands (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    CONSTRAINT unique_brand_per_company UNIQUE (company_id, name)

);

CREATE TABLE strains (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(255) NOT NULL,
    company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    type VARCHAR(50),
    description TEXT,
    CONSTRAINT unique_strain_per_company UNIQUE (company_id, name)

);

CREATE TABLE categories (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    CONSTRAINT unique_category_per_company UNIQUE (company_id, name)
);

CREATE TABLE users (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role user_role DEFAULT 'staff',
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Depends on Companies + Metadata
CREATE TABLE products (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    brand_id INTEGER REFERENCES brands(id) ON DELETE SET NULL,
    strain_id INTEGER REFERENCES strains(id) ON DELETE SET NULL,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    unit unit NOT NULL,
    sku VARCHAR(100),
    status product_status NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (company_id, sku)
);

CREATE TABLE batches (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    batch_number VARCHAR(100) NOT NULL,
    total_quantity DECIMAL(10,3) NOT NULL,
    unit unit NOT NULL,
    cost_per_unit DECIMAL(10,2),
    supplier_name VARCHAR(255),
    status inventory_status DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(product_id, batch_number)
);

-- Depends on Products + Companies

CREATE TABLE locations (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    company_id INTEGER NOT NULL 
        REFERENCES companies(id) 
        ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_company_location_name 
        UNIQUE (company_id, name),
    CONSTRAINT unique_location_company_pair
        UNIQUE (id, company_id)
);

CREATE TABLE packages (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    package_tag VARCHAR(24) NOT NULL,
    external_id VARCHAR(255),
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    parent_package_id INTEGER REFERENCES packages(id) ON DELETE SET NULL,
    batch_id INTEGER REFERENCES batches(id) ON DELETE SET NULL,
    location_id INTEGER NOT NULL,
    status inventory_status NOT NULL DEFAULT 'active',
    quantity DECIMAL(10,3) NOT NULL DEFAULT 0,
    package_size DECIMAL(10,3) DEFAULT NULL,        
    unit unit NOT NULL DEFAULT 'g', 
    cost_price DECIMAL(10,2),
    supplier_name VARCHAR(255),
    lot_number VARCHAR(100),
    locked BOOLEAN NOT NULL DEFAULT FALSE,
    updated_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (package_tag),
    FOREIGN KEY (location_id, company_id)
        REFERENCES locations(id, company_id) ON DELETE RESTRICT
);

-- Tranfers 

CREATE TABLE transfers (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    transfer_type VARCHAR(20) NOT NULL CHECK (transfer_type IN ('internal', 'external')),
    from_location_id INTEGER NOT NULL REFERENCES locations(id),
    to_location_id INTEGER REFERENCES locations(id),
    to_company_name VARCHAR(255),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    notes TEXT,
    created_by INTEGER NOT NULL REFERENCES users(id),
    confirmed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT internal_requires_to_location 
        CHECK (transfer_type = 'external' OR to_location_id IS NOT NULL),
    CONSTRAINT external_requires_company_name 
        CHECK (transfer_type = 'internal' OR to_company_name IS NOT NULL)
);

CREATE TABLE transfer_items (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    transfer_id INTEGER NOT NULL REFERENCES transfers(id) ON DELETE CASCADE,
    package_id INTEGER NOT NULL REFERENCES packages(id),
    quantity NUMERIC NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE invites (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    company_id INTEGER NOT NULL REFERENCES companies(id),
    email VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'manager', 'staff')),
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    created_by INTEGER REFERENCES users(id),
    accepted_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Audit Trail
CREATE TABLE inventory_movements (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE, 
    packages_id INTEGER NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    movement_type VARCHAR(50) NOT NULL,
    quantity DECIMAL(10,3) NOT NULL,
    starting_quantity DECIMAL(10,3),
    ending_quantity DECIMAL(10,3),
    cost_per_unit DECIMAL(10,2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_locations_company 
    ON locations(company_id);

CREATE INDEX idx_packages_company 
    ON packages(company_id);

CREATE INDEX idx_packages_location 
    ON packages(location_id);