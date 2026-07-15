import { DataTable } from '../../charts/DataTable';
import { Decline } from '../Decline';

interface TracyResponse {
	sql: string;
	explanation: string;
	tables_used: string[];
	result: Record<string, unknown>[];
}
export const TracyResult = ({ response }: { response: TracyResponse }) => {
	const result = response?.result;
	if (!result) return <Decline message={response.explanation} />;
	if (result.length === 0) return <Decline message={'No matching rows'} />;

	if (result.length >= 1) {
		return <DataTable result={result} />;
	}
};
