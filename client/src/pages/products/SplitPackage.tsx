import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

interface PackageInfo {
	id: number;
	package_tag: string;
	quantity: number;
	unit: string;
	product_id: number;
}

interface ProductInfo {
	id: number;
	name: string;
	sku: string;
	unit: string;
}

interface SplitRow {
	packageTag: string;
	packageSize: string;
}

const SplitPackage = () => {
	const { packageTag } = useParams<{ packageTag: string }>();
	const navigate = useNavigate();
	const [selectedPackage, setSelectedPackage] = useState<PackageInfo | null>(null);
	const [product, setProduct] = useState<ProductInfo | null>(null);
	const [rows, setRows] = useState<SplitRow[]>([{ packageTag: '', packageSize: '1' }]);
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState('');

	useEffect(() => {
		const fetchData = async () => {
			const res = await fetch(`/api/packages/${packageTag}/split`);
			if (!res.ok) { navigate('/packages'); return; }
			const data = await res.json();
			setSelectedPackage(data.selectedPackage);
			setProduct(data.product);
			setLoading(false);
		};
		fetchData();
	}, [packageTag, navigate]);

	const totalUsed = rows.reduce((sum, r) => sum + (parseFloat(r.packageSize) || 0), 0);
	const remaining = selectedPackage ? parseFloat(String(selectedPackage.quantity)) - totalUsed : 0;

	const updateRow = (i: number, field: keyof SplitRow, value: string) => {
		setRows(prev => prev.map((r, idx) => idx === i ? { ...r, [field]: value } : r));
	};

	const addRow = () => setRows(prev => [...prev, { packageTag: '', packageSize: '1' }]);
	const removeRow = (i: number) => setRows(prev => prev.filter((_, idx) => idx !== i));

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!selectedPackage) return;
		if (totalUsed > parseFloat(String(selectedPackage.quantity))) {
			setError('Split exceeds available quantity');
			return;
		}
		setSubmitting(true);
		setError('');
		const res = await fetch(`/api/packages/${packageTag}/split`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				productId: rows.map(() => String(product?.id)),
				packageSize: rows.map(r => r.packageSize),
				packageTag: rows.map(r => r.packageTag),
				quantity: rows.map(r => r.packageSize),
			}),
		});
		const data = await res.json();
		if (data.success) {
			navigate(`/packages/${data.productId}`);
		} else {
			setError(data.error || 'Failed to split package');
			setSubmitting(false);
		}
	};

	if (loading) return <div className="max-w-2xl mx-auto px-4 py-8"><p className="text-sm text-gray-500">Loading...</p></div>;
	if (!selectedPackage || !product) return null;

	return (
		<div className="bg-gray-50 font-sans text-gray-900 min-h-screen flex flex-col">
			<div className="max-w-2xl mx-auto px-6 py-8 flex-1 w-full">
				<Link to={`/packages/${product.id}`} className="inline-flex items-center gap-1.5 text-[0.8125rem] text-gray-500 hover:text-gray-700 transition-colors no-underline mb-6">
					← Back to product
				</Link>
				<div className="mb-6">
					<h1 className="text-xl font-semibold tracking-tight text-gray-900">Split Package</h1>
					<p className="text-sm text-gray-500 font-light mt-0.5">Create child lots from existing inventory</p>
				</div>

				{error && (
					<div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-[0.8125rem] text-red-700">{error}</div>
				)}

				<div className="space-y-4">
					{/* Parent Package Info */}
					<div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
						<div className="px-6 py-5">
							<div className="text-[0.7rem] font-mono text-gray-500 uppercase tracking-[0.08em] mb-4">Parent Package</div>
							<div className="grid grid-cols-3 gap-4">
								<div>
									<div className="text-[0.7rem] font-mono text-gray-500 uppercase tracking-[0.06em] mb-1">SKU</div>
									<div className="text-[0.875rem] font-mono font-medium text-gray-800">{product.sku}</div>
								</div>
								<div>
									<div className="text-[0.7rem] font-mono text-gray-500 uppercase tracking-[0.06em] mb-1">Product</div>
									<div className="text-[0.875rem] font-medium text-gray-800">{product.name}</div>
								</div>
								<div>
									<div className="text-[0.7rem] font-mono text-gray-500 uppercase tracking-[0.06em] mb-1">Available</div>
									<div className="text-[0.875rem] font-medium text-gray-800">
										<span className={remaining < 0 ? 'text-red-500' : ''}>{Number(selectedPackage.quantity).toFixed(3)}</span>
										<span className="text-gray-500 ml-1">{product.unit}</span>
									</div>
								</div>
							</div>
							{remaining !== parseFloat(String(selectedPackage.quantity)) && (
								<div className="mt-3 flex items-center gap-4 text-[0.8125rem]">
									<span className="text-gray-500">Used: <span className="font-mono text-gray-700">{totalUsed.toFixed(3)}</span></span>
									<span className={remaining < 0 ? 'text-red-500 font-medium' : 'text-gray-500'}>
										Remaining: <span className="font-mono">{remaining.toFixed(3)}</span>
									</span>
								</div>
							)}
						</div>
					</div>

					{/* Split Form */}
					<div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
						<form onSubmit={handleSubmit}>
							<div className="px-6 py-5 border-b border-gray-100">
								<div className="flex items-center justify-between mb-4">
									<div className="text-[0.7rem] font-mono text-gray-500 uppercase tracking-[0.08em]">Split Rows</div>
									<button
										type="button"
										onClick={addRow}
										className="text-[0.75rem] text-green-mid hover:text-green-deep font-medium transition-colors cursor-pointer"
									>
										+ Add Row
									</button>
								</div>
								<div className="space-y-3">
									{rows.map((row, i) => (
										<div key={i} className="grid grid-cols-3 gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg">
											<div>
												<label className="block text-[0.7rem] font-mono text-gray-500 uppercase tracking-[0.06em] mb-1">Package Tag</label>
												<input
													type="text"
													value={row.packageTag}
													onChange={e => updateRow(i, 'packageTag', e.target.value)}
													required
													className="w-full px-3 py-2 text-[0.875rem] font-mono border border-gray-300 rounded-md bg-white"
												/>
											</div>
											<div>
												<label className="block text-[0.7rem] font-mono text-gray-500 uppercase tracking-[0.06em] mb-1">Size ({product.unit})</label>
												<input
													type="number"
													value={row.packageSize}
													onChange={e => updateRow(i, 'packageSize', e.target.value)}
													step="0.01"
													min="0"
													required
													className="w-full px-3 py-2 text-[0.875rem] border border-gray-300 rounded-md bg-white"
												/>
											</div>
											<div className="flex flex-col">
												<label className="block text-[0.7rem] font-mono text-gray-500 uppercase tracking-[0.06em] mb-1">Total ({product.unit})</label>
												<div className="flex items-center gap-2">
													<input
														type="text"
														value={(parseFloat(row.packageSize) || 0).toFixed(3)}
														readOnly
														className="w-full px-3 py-2 text-[0.875rem] border border-gray-200 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
													/>
													{rows.length > 1 && (
														<button
															type="button"
															onClick={() => removeRow(i)}
															className="text-gray-500 hover:text-red-500 transition-colors text-lg leading-none"
														>
															×
														</button>
													)}
												</div>
											</div>
										</div>
									))}
								</div>
							</div>
							<div className="px-6 py-4 bg-gray-50 flex items-center justify-between gap-3">
								<Link
									to={`/packages/${product.id}`}
									className="inline-flex items-center justify-center px-4 py-[0.4rem] text-[0.8125rem] font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-white hover:border-gray-400 transition-colors no-underline"
								>
									Cancel
								</Link>
								<button
									type="submit"
									disabled={submitting || remaining < 0}
									className="inline-flex items-center justify-center px-5 py-[0.4rem] text-[0.8125rem] font-medium text-white bg-green-mid border border-green-mid rounded-md hover:bg-green-deep hover:border-green-deep transition-colors cursor-pointer disabled:opacity-50"
								>
									{submitting ? 'Splitting...' : 'Confirm Split'}
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SplitPackage;
