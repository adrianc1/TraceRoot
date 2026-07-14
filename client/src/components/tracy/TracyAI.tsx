import { useState } from 'react';
import { SparkleIcon } from './SparkleIcon';
import { TracyResult } from './TracyResult/TracyResult';

interface TracyResponse {
	sql: string;
	explanation: string;
	tables_used: string[];
	result: Record<string, unknown>[];
}

export const TracyAI = () => {
	const [userSearch, setUserSearch] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(false);
	const [response, setResponse] = useState<TracyResponse | null>(null);

	const handleFormSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);

		const res = await fetch('/api/tracy/', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ question: userSearch }),
		});

		const data = await res.json();

		setResponse(data);
		console.log('Tracy response:', data);
	};

	return (
		<div className="">
			<form
				onSubmit={handleFormSubmit}
				className="w-full md:w-2/3 flex items-center gap-2 mb-6"
			>
				<label htmlFor="tracy-user-input" className="sr-only">
					Ask about your inventory
				</label>
				<input
					type="text"
					className={`flex-1 min-w-0 px-3 py-[0.4rem] text-[0.8125rem] border border-gray-300 rounded-md bg-white transition-all focus:border-green-mid focus:outline-none `}
					id="tracy-user-input"
					value={userSearch}
					onChange={(e) => setUserSearch(e.target.value)}
					placeholder="Ask about your inventory"
				/>
				<button
					type="submit"
					className={`px-4 py-[0.4rem] text-[0.8125rem] font-medium text-green-mid bg-white border border-green-mid rounded-md hover:bg-green-deep hover:text-white hover:border-green-deep transition-colors inline-flex items-center gap-1.5 `}
				>
					<SparkleIcon className="w-4 h-4" />
					Ask Tracy
				</button>
			</form>

			{response && <TracyResult response={response} />}
		</div>
	);
};
