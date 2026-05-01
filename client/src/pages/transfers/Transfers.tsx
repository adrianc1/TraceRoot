import { useState, useEffect } from 'react';
import type { TransferStatus, TransferSummary } from '../../types/transfers';

const Transfers = () => {
	const [transfers, setTransfers] = useState<TransferSummary[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const STATUS_STYLES: Record<TransferStatus, string> = {
		pending: 'bg-amber-50 text-amber-700',
		confirmed: 'bg-green-light text-green-deep',
		cancelled: 'bg-gray-100 text-gray-500',
	};

	const TRANSFER_TYPE_STYLES: Record<string, string> = {
		internal: 'bg-blue-50 text-blue-700',
		external: 'bg-purple-50 text-purple-700',
	};

	useEffect(() => {
		const fetchTransfers = async () => {
			try {
				const response = await fetch('/api/transfers');
				if (!response.ok) {
					throw new Error('Failed to fetch transfers');
				}
				const data = await response.json();
				setTransfers(data);
			} catch (error) {
				console.error('Error fetching transfers:', error);
				setError('Error fetching transfers');
			} finally {
				setLoading(false);
			}
		};
		fetchTransfers();
	}, []);

	if (loading) return <div>Loading...</div>;
	if (error) return <div>{error}</div>;

	return (
		<div className="max-w-7xl mx-auto px-6 py-8 flex-1 w-full">
			{/* <!-- page header --> */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
				<div>
					<h1 className="text-xl font-semibold tracking-tight text-gray-900">
						Transfers
					</h1>
					<p className="text-sm text-gray-400 font-light mt-0.5">
						All inventory transfers for your company
					</p>
				</div>
				<div className="flex flex-row items-center gap-2">
					<a
						href="api/transfers/export"
						className="inline-flex items-center justify-center whitespace-nowrap px-4 py-[0.4rem] text-[0.8125rem] font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 transition-colors no-underline"
					>
						Export CSV
					</a>
					<a
						href="/transfers/create"
						className="inline-flex items-center justify-center whitespace-nowrap px-4 py-[0.4rem] text-[0.8125rem] font-medium text-white bg-green-mid border border-green-mid rounded-md hover:bg-green-deep hover:border-green-deep transition-colors no-underline"
					>
						+ New Transfer
					</a>
				</div>
			</div>

			{/* <!-- table container --> */}
			<div className="border border-gray-200 rounded-xl overflow-x-auto bg-white">
				<table className="w-full border-collapse">
					<thead>
						<tr className="border-b border-gray-200 bg-gray-50">
							<th className="text-left text-[0.7rem] font-medium text-gray-600 uppercase tracking-[0.06em] px-4 py-3">
								#
							</th>
							<th className="text-left text-[0.7rem] font-medium text-gray-600 uppercase tracking-[0.06em] px-4 py-3">
								Type
							</th>
							<th className="text-left text-[0.7rem] font-medium text-gray-600 uppercase tracking-[0.06em] px-4 py-3">
								From
							</th>
							<th className="text-left text-[0.7rem] font-medium text-gray-600 uppercase tracking-[0.06em] px-4 py-3">
								To
							</th>
							<th className="text-left text-[0.7rem] font-medium text-gray-600 uppercase tracking-[0.06em] px-4 py-3">
								Packages
							</th>
							<th className="text-left text-[0.7rem] font-medium text-gray-600 uppercase tracking-[0.06em] px-4 py-3">
								Status
							</th>
							<th className="text-left text-[0.7rem] font-medium text-gray-600 uppercase tracking-[0.06em] px-4 py-3">
								Date
							</th>
							<th className="text-left text-[0.7rem] font-medium text-gray-600 uppercase tracking-[0.06em] px-4 py-3"></th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-100">
						{transfers?.map((t) => {
							const typeStyle =
								STATUS_STYLES[t.status] || STATUS_STYLES.pending;

							const transferTypeStyle =
								TRANSFER_TYPE_STYLES[t.transfer_type] ||
								TRANSFER_TYPE_STYLES.internal;
							return (
								<tr className="hover:bg-gray-50 transition-colors">
									{/* <!-- transfer id --> */}
									<td className="px-4 py-3">
										<span className="font-mono text-[0.75rem] text-gray-500">
											{t.id}
										</span>
									</td>

									{/* <!-- type --> */}
									<td className="px-4 py-3">
										<span
											className={`inline-flex items-center font-mono text-[0.7rem] font-medium px-2 py-[0.2rem] rounded capitalize ${transferTypeStyle}`}
										>
											{t.transfer_type}
										</span>
									</td>

									{/* <!-- from --> */}
									<td className="px-4 py-3">
										<span className="text-[0.8125rem] text-gray-700">
											{t.from_location}
										</span>
									</td>

									{/* <!-- To --> */}
									<td className="px-4 py-3">
										<span className="text-[0.8125rem] text-gray-700">
											{t.to_location ? t.to_location : t.to_company_name}
										</span>
									</td>

									{/* <!-- Package count --> */}
									<td className="px-4 py-3">
										<span className="text-[0.8125rem] font-semibold text-gray-900">
											{t.package_count}
										</span>
									</td>

									{/* <!-- Status --> */}
									<td className="px-4 py-3">
										<span
											className={`inline-flex items-center font-mono text-[0.7rem] font-medium px-2 py-[0.2rem] rounded capitalize ${typeStyle}`}
										>
											{t.status}
										</span>
									</td>

									{/* <!-- Date --> */}
									<td className="px-4 py-3">
										<span className="text-[0.8125rem] text-gray-400">
											{new Date(t.created_at).toLocaleDateString('en-US', {
												year: 'numeric',
												month: 'short',
												day: 'numeric',
											})}
										</span>
									</td>

									{/* <!-- Actions --> */}
									<td className="px-4 py-3">
										<a
											href={`/transfers/${t.id}`}
											className="text-[0.75rem] text-gray-400 hover:text-gray-700 transition-colors font-medium no-underline"
										>
											View
										</a>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>

				{/* <!-- empty state if htere are no transfers --> */}
				{transfers.length === 0 && (
					<div className="py-16 text-center">
						<div className="text-gray-300 text-4xl mb-3">⇄</div>
						<p className="text-sm font-medium text-gray-500">
							No transfers yet
						</p>
						<p className="text-xs text-gray-400 mt-1 mb-4">
							Create your first transfer to move inventory
						</p>
						<a
							href="/transfers/create"
							className="inline-flex items-center justify-center px-4 py-[0.4rem] text-[0.8125rem] font-medium text-white bg-green-mid border border-green-mid rounded-md hover:bg-green-deep transition-colors no-underline"
						>
							New Transfer
						</a>
					</div>
				)}

				{/* <!-- Table footer --> */}
				{transfers && transfers.length > 0 && (
					<div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
						<span className="font-mono text-[0.72rem] text-gray-400">
							<span className="text-gray-600 font-medium">
								{transfers.length}
							</span>{' '}
							transfers
						</span>
					</div>
				)}
			</div>
		</div>
	);
};

export default Transfers;
