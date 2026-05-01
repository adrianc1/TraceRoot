import { useState } from 'react';

const TransferForm = () => {
	const [transferType, setTransferType] = useState<'internal' | 'external' | ''>('');

	return (
		<div className="max-w-2xl mx-auto px-6 py-8 flex-1 w-full">
			<a
				href="/transfers"
				className="inline-flex items-center gap-1.5 text-[0.8125rem] text-gray-400 hover:text-gray-700 transition-colors no-underline mb-6"
			>
				← Back to transfers
			</a>

			<div className="mb-6">
				<h1 className="text-xl font-semibold tracking-tight text-gray-900">New Transfer</h1>
				<p className="text-sm text-gray-400 font-light mt-0.5">
					Move inventory between locations or to an external company
				</p>
			</div>

			<div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
				<form>
					{/* Transfer Info */}
					<div className="px-6 py-5 border-b border-gray-100">
						<div className="text-[0.7rem] font-mono text-gray-400 uppercase tracking-[0.08em] mb-4">
							Transfer Info
						</div>
						<div className="space-y-4">

							{/* Transfer Type */}
							<div>
								<label className="block text-[0.8125rem] font-medium text-gray-700 mb-1.5">
									Transfer Type <span className="text-red-400">*</span>
								</label>
								<select
									name="transfer_type"
									required
									value={transferType}
									onChange={(e) => setTransferType(e.target.value as 'internal' | 'external' | '')}
									className="w-full px-3 py-2 text-[0.875rem] border border-gray-300 rounded-md bg-white text-gray-700"
								>
									<option value="">— Select type —</option>
									<option value="internal">Internal</option>
									<option value="external">External</option>
								</select>
							</div>

							{/* From Location */}
							<div>
								<label className="block text-[0.8125rem] font-medium text-gray-700 mb-1.5">
									From Location <span className="text-red-400">*</span>
								</label>
								<select
									name="from_location_id"
									required
									className="w-full px-3 py-2 text-[0.875rem] border border-gray-300 rounded-md bg-white text-gray-700"
								>
									<option value="">— Select location —</option>
									{/* locations.map goes here */}
								</select>
							</div>

							{/* To Location (internal only) */}
							{transferType === 'internal' && (
								<div>
									<label className="block text-[0.8125rem] font-medium text-gray-700 mb-1.5">
										To Location <span className="text-red-400">*</span>
									</label>
									<select
										name="to_location_id"
										required
										className="w-full px-3 py-2 text-[0.875rem] border border-gray-300 rounded-md bg-white text-gray-700"
									>
										<option value="">— Select location —</option>
										{/* locations.map goes here */}
									</select>
								</div>
							)}

							{/* To Company (external only) */}
							{transferType === 'external' && (
								<div>
									<label className="block text-[0.8125rem] font-medium text-gray-700 mb-1.5">
										Destination Company <span className="text-red-400">*</span>
									</label>
									<input
										type="text"
										name="to_company_name"
										placeholder="Acme Dispensary"
										required
										className="w-full px-3 py-2 text-[0.875rem] border border-gray-300 rounded-md bg-white placeholder-gray-300"
									/>
								</div>
							)}

							{/* Notes */}
							<div>
								<label className="block text-[0.8125rem] font-medium text-gray-700 mb-1.5">
									Notes{' '}
									<span className="text-[0.75rem] text-gray-400 font-light ml-1">optional</span>
								</label>
								<textarea
									name="notes"
									rows={2}
									placeholder="Any additional context..."
									className="w-full px-3 py-2 text-[0.875rem] border border-gray-300 rounded-md resize-none bg-white placeholder-gray-300"
								/>
							</div>
						</div>
					</div>

					{/* Packages */}
					<div className="px-6 py-5 border-b border-gray-100">
						<div className="flex items-center justify-between mb-4">
							<div className="text-[0.7rem] font-mono text-gray-400 uppercase tracking-[0.08em]">
								Packages
							</div>
							<button
								type="button"
								className="text-[0.75rem] text-green-mid hover:text-green-deep font-medium transition-colors cursor-pointer"
							>
								+ Add Package
							</button>
						</div>

						<div className="space-y-3">
							{/* items.map goes here */}
						</div>

						<p className="text-[0.8125rem] text-gray-400 italic">No packages added yet</p>
					</div>

					{/* Form Actions */}
					<div className="px-6 py-4 bg-gray-50 flex items-center justify-between gap-3">
						<a
							href="/transfers"
							className="inline-flex items-center justify-center px-4 py-[0.4rem] text-[0.8125rem] font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-white hover:border-gray-400 transition-colors no-underline"
						>
							Cancel
						</a>
						<button
							type="submit"
							className="inline-flex items-center justify-center px-5 py-[0.4rem] text-[0.8125rem] font-medium text-white bg-green-mid border border-green-mid rounded-md hover:bg-green-deep hover:border-green-deep transition-colors cursor-pointer"
						>
							Create Transfer
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default TransferForm;
