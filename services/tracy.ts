import { Anthropic } from '@anthropic-ai/sdk';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import { z } from 'zod';
import 'dotenv/config';

const client = new Anthropic({
	apiKey: process.env.ANTHROPIC_API_KEY,
});

const SCHEMA = `You write PostgreSQL SELECT queries for a cannabis inventory system.
Use ONLY the tables and columns listed below. Never reference anything not listed here.

TABLES:

packages(
  id, package_tag, external_id, product_id, company_id, parent_package_id,
  batch_id, location_id,
  status  -- enum inventory_status, one of: 'active','inactive','quarantine','damaged','expired','reserved'
  quantity DECIMAL, package_size DECIMAL,
  unit    -- enum unit, one of: 'mg','g','kg','oz','lb','ml','l','each'
  cost_price DECIMAL, supplier_name, lot_number, locked BOOLEAN,
  created_at TIMESTAMPTZ, updated_at TIMESTAMPTZ)
  -- A package is a PHYSICAL unit of stock. 'quantity' is the on-hand amount. Stock levels live here.

products(
  id, company_id, brand_id, strain_id, category_id, name, description,
  unit    -- enum unit, one of: 'mg','g','kg','oz','lb','ml','l','each'
  sku,
  status  -- enum product_status, one of: 'active','archived'
  created_at TIMESTAMPTZ)
  -- A product is the CATALOG item. It has NO quantity column. Stock is on its packages.

brands(id, name, description, company_id)
categories(id, name, description, company_id)
strains(id, name, company_id, type, description)

locations(
  id, company_id, name, description, is_active BOOLEAN,
  created_at TIMESTAMPTZ, updated_at TIMESTAMPTZ)

batches(
  id, product_id, company_id, batch_number, total_quantity DECIMAL,
  unit, cost_per_unit DECIMAL, supplier_name,
  status  -- enum inventory_status, one of: 'active','inactive','quarantine','damaged','expired','reserved'
  created_at TIMESTAMPTZ)

inventory_movements(
  id, company_id, packages_id, user_id, movement_type, quantity DECIMAL,
  starting_quantity DECIMAL, ending_quantity DECIMAL, cost_per_unit DECIMAL,
  notes, created_at TIMESTAMPTZ)
  -- One immutable row per stock change. The FK column is 'packages_id' (with an 's'), NOT 'package_id'.

RELATIONSHIPS (join keys):
  packages.product_id             -> products.id
  packages.location_id            -> locations.id
  packages.batch_id               -> batches.id
  products.brand_id               -> brands.id
  products.strain_id              -> strains.id
  products.category_id            -> categories.id
  inventory_movements.packages_id -> packages.id

RULES:
  - Do NOT add WHERE conditions the user did not ask for. In particular, do not filter on status unless the user mentions status.
  - When you do filter an enum column, use only the values listed inline for that exact column. 'archived' is valid for products.status ONLY, never for packages.status.
  - "Stock level" / "units on hand" means packages.quantity, per package, unless the user explicitly asks to aggregate by product.
  - Do NOT filter on company_id. The database scopes every query to the current company automatically via row-level security; adding a company_id predicate is unnecessary and forbidden.
  - Timestamps are timestamptz. When the user says "today" or names a date, bucket it in America/Los_Angeles, e.g. (created_at AT TIME ZONE 'America/Los_Angeles')::date.
  - Return exactly one SELECT statement. No INSERT, UPDATE, DELETE, DDL, or multiple statements.
  - If a question cannot be answered from these columns, set sql to an empty string and explain why in the explanation field.
`;

const TracyAnswer = z.object({
	sql: z.string().describe('A single read-only SELECT query'),
	explanation: z.string().describe('One sentence explaining what it does'),
	tables_used: z.array(z.string()),
});

async function main() {
	const message = await client.messages.parse({
		model: 'claude-haiku-4-5',
		max_tokens: 1024,
		system: [
			{ type: 'text', text: SCHEMA, cache_control: { type: 'ephemeral' } },
		],
		messages: [
			{
				role: 'user',
				content: 'What is the most valuable product in our inventory?',
			},
		],
		output_config: { format: zodOutputFormat(TracyAnswer) },
	});
	console.log(message.parsed_output);
}

main();
