import { askTracy } from '../services/tracy';
import { tracyQuery } from '../db/queries/tracy';
import tracyPool from '../db/tracyPool';

// Usage: npx tsx scripts/tryTracy.ts "<question>" [company_id]
const question = process.argv[2] ?? 'What is my most valuable product?';
const company_id = Number(process.argv[3] ?? 1);

const main = async () => {
	console.log(`\nQ: ${question}   (company_id=${company_id})\n`);

	const answer = await askTracy(question);
	console.log('sql:        ', answer?.sql);
	console.log('explanation:', answer?.explanation);
	console.log('tables_used:', answer?.tables_used);

	if (!answer?.sql) {
		console.log('\nNo SQL returned — nothing to execute.');
		return;
	}

	const rows = await tracyQuery(answer.sql, company_id);
	console.log(`\nrows (${rows.length}):`);
	console.table(rows);
};

main()
	.catch((err) => {
		console.error('\nFAILED:', err.message);
		process.exitCode = 1;
	})
	.finally(() => tracyPool.end());
