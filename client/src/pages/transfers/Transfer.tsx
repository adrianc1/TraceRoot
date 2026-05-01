import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { TransferDetail } from '../../types/transfers';

const Transfer = () => {
	const [transfer, setTransfer] = useState<TransferDetail | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const { id } = useParams();

	useEffect(() => {
		const fetchTransfer = async () => {
			try {
				const response = await fetch(`/api/transfers/${id}`);
				if (!response.ok) {
					throw new Error('Failed to fetch transfer details');
				}
				const data = await response.json();
				setTransfer(data);
			} catch (error) {
				console.error('Error fetching transfer details:', error);
				setError('Error fetching transfer details');
			} finally {
				setLoading(false);
			}
		};
		fetchTransfer();
	}, [id]);

	if (loading) return <div>Loading...</div>;
	if (error) return <div>{error}</div>;
	if (!transfer) return <div>Transfer not found</div>;
	return (
		<div className="">
			<div className="max-w-4xl mx-auto px-6 py-8 flex-1 w-full">
				<a
					href="/transfers"
					className="inline-flex items-center gap-1.5 text-[0.8125rem] text-gray-600 hover:text-gray-700 transition-colors no-underline mb-6"
				>
					← Back to transfers
				</a>

				{/* <!-- Page header --> */}
				<div className="flex items-center justify-between mb-6">
					<div>
						<h1 className="text-xl font-semibold tracking-tight text-gray-900">
							Transfer #{transfer.id} here
						</h1>
						<p className="text-sm text-gray-600 font-light mt-0.5">
							Created by: {transfer.created_by} on{' '}
							{new Date(transfer.created_at).toLocaleDateString('en-US', {
								month: 'short',
								day: 'numeric',
								year: 'numeric',
							})}
						</p>
					</div>
					{/* <!-- Actions --> */}
					{transfer.status === 'pending' && (
						<div className="flex items-center gap-2">
							<button className="inline-flex items-center justify-center px-4 py-[0.4rem] text-[0.8125rem] font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 transition-colors cursor-pointer">
								Cancel
							</button>
							<button className="inline-flex items-center justify-center px-4 py-[0.4rem] text-[0.8125rem] font-medium text-white bg-green-mid border border-green-mid rounded-md hover:bg-green-deep hover:border-green-deep transition-colors cursor-pointer">
								Confirm Transfer
							</button>
						</div>
					)}
				</div>

				{/* <!-- Meta card --> */}
				<div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-6">
					<div className="px-6 py-4 border-b border-gray-100">
						<div className="text-[0.7rem] font-mono text-gray-400 uppercase tracking-[0.08em]">
							Transfer Details
						</div>
					</div>
					<div className="px-6 py-5 grid grid-cols-2 gap-6">
						<div>
							<div className="text-[0.75rem] text-gray-400 mb-1">Type</div>

							<span className="inline-flex items-center font-mono text-[0.7rem] font-medium px-2 py-[0.2rem] rounded capitalize">
								{transfer.transfer_type}
							</span>
						</div>
						<div>
							<div className="text-[0.75rem] text-gray-400 mb-1">Status</div>

							<span className="inline-flex items-center font-mono text-[0.7rem] font-medium px-2 py-[0.2rem] rounded capitalize">
								{transfer.status}
							</span>
						</div>
						<div>
							<div className="text-[0.75rem] text-gray-400 mb-1">From</div>
							<div className="text-[0.8125rem] font-medium text-gray-900">
								{transfer.from_location}
							</div>
						</div>
						<div>
							<div className="text-[0.75rem] text-gray-400 mb-1">To</div>
							<div className="text-[0.8125rem] font-medium text-gray-900">
								{transfer.to_location || transfer.to_company_name || '—'}
							</div>
						</div>
						{transfer.confirmed_at && (
							<div>
								<div className="text-[0.75rem] text-gray-400 mb-1">
									Confirmed At
								</div>
								<div className="text-[0.8125rem] text-gray-700">
									{new Date(transfer.confirmed_at).toLocaleDateString('en-US', {
										month: 'short',
										day: 'numeric',
										year: 'numeric',
									})}
								</div>
							</div>
						)}
						{transfer.notes && (
							<div className="col-span-2">
								<div className="text-[0.75rem] text-gray-400 mb-1">Notes</div>
								<div className="text-[0.8125rem] text-gray-700">
									{transfer.notes}
								</div>
							</div>
						)}
					</div>
				</div>

				{/* <!-- Line items --> */}
				<div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
					<div className="px-6 py-4 border-b border-gray-100">
						<div className="text-[0.7rem] font-mono text-gray-400 uppercase tracking-[0.08em]">
							Packages
						</div>
					</div>
					<table className="w-full border-collapse">
						<thead>
							<tr className="border-b border-gray-200 bg-gray-50">
								<th className="text-left text-[0.7rem] font-medium text-gray-400 uppercase tracking-[0.06em] px-4 py-3">
									Package Tag
								</th>
								<th className="text-left text-[0.7rem] font-medium text-gray-400 uppercase tracking-[0.06em] px-4 py-3">
									Product
								</th>
								<th className="text-left text-[0.7rem] font-medium text-gray-400 uppercase tracking-[0.06em] px-4 py-3">
									Category
								</th>
								<th className="text-left text-[0.7rem] font-medium text-gray-400 uppercase tracking-[0.06em] px-4 py-3">
									Transfer Qty
								</th>
								<th className="text-left text-[0.7rem] font-medium text-gray-400 uppercase tracking-[0.06em] px-4 py-3">
									Cost Per Unit
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100">
							{transfer.items.map((item) => (
								<tr
									key={item.id}
									className="hover:bg-gray-50 transition-colors"
								>
									<td className="px-4 py-3">
										<span className="font-mono text-[0.75rem] text-gray-500">
											{item.package_tag}
										</span>
									</td>
									<td className="px-4 py-3">
										<span className="text-[0.8125rem] font-medium text-gray-900">
											{item.product_name}
										</span>
									</td>
									<td className="px-4 py-3">
										<span className="text-[0.8125rem] font-medium text-gray-900">
											{item.category_name}
										</span>
									</td>
									<td className="px-4 py-3">
										<span className="text-[0.8125rem] font-semibold text-gray-900">
											{item.quantity} {item.unit}
										</span>
									</td>
									<td className="px-4 py-3">
										<span className="text-[0.8125rem] text-gray-500">
											${item.cost_price}
										</span>
									</td>
								</tr>
							))}
							{transfer.items.length === 0 && (
								<tr>
									<td
										colSpan={5}
										className="px-4 py-3 text-center text-gray-500"
									>
										No items to display
									</td>
								</tr>
							)}
						</tbody>
					</table>
					<div className="flex justify-between px-4 py-3 border-t border-gray-100 bg-gray-50">
						<span className="font-mono text-[0.72rem] text-gray-400">
							<span className="text-gray-600 font-medium">
								{transfer.items.length}
							</span>{' '}
							packages
						</span>
						<span className="font-mono text-[0.72rem] text-gray-400">
							Total:{' '}
							<span className="text-gray-600 font-medium">
								$
								{transfer.items
									.reduce(
										(sum, item) =>
											sum + parseFloat(item.cost_price) * item.current_quantity,
										0,
									)
									.toFixed(2)}
							</span>
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Transfer;
