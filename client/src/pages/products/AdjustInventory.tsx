import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import type { PackageStatus } from '../../types/package';

interface PackageInfo {
	id: number;
	package_tag: string;
	quantity: number;
	unit: string;
	cost_price: number;
	status: PackageStatus;
	lot_number: string | null;
	product_id: number;
}

interface FormData {
	quantity: string;
	unit: string;
	cost_price_unit: string;
	movement_type: string;
	status: string;
	notes: string;
}

const AdjustInventory = () => {
	const { packageTag } = useParams<{ packageTag: string }>();
	const navigate = useNavigate();
	const [pkg, setPkg] = useState<PackageInfo | null>(null);
	const [productName, setProductName] = useState('');
	const [brand, setBrand] = useState<{ name: string } | null>(null);
	const [strain, setStrain] = useState<{ name: string } | null>(null);
	const [category, setCategory] = useState<{ name: string } | null>(null);
	const [adjustmentReasons, setAdjustmentReasons] = useState<string[]>([]);
	const [statusOptions, setStatusOptions] = useState<string[]>([]);
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState('');

	const [form, setForm] = useState<FormData>({
		quantity: '', unit: '', cost_price_unit: '',
		movement_type: '', status: '', notes: '',
	});

	useEffect(() => {
		const fetchData = async () => {
			const res = await fetch(`/api/packages/${packageTag}/adjust`);
			if (!res.ok) { navigate('/packages'); return; }
			const data = await res.json();
			setPkg(data.package);
			setProductName(data.product.name);
			setBrand(data.brand);
			setStrain(data.strain);
			setCategory(data.category);
			setAdjustmentReasons(data.adjustmentReasons);
			setStatusOptions(data.statusOptions);
			setForm({
				quantity: String(data.package.quantity),
				unit: data.package.unit,
				cost_price_unit: String(data.package.cost_price || ''),
				movement_type: '',
				status: data.package.status,
				notes: '',
			});
			setLoading(false);
		};
		fetchData();
	}, [packageTag, navigate]);

	const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
		setForm(prev => ({ ...prev, [field]: e.target.value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitting(true);
		setError('');
		const res = await fetch(`/api/packages/${packageTag}/adjust`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(form),
		});
		const data = await res.json();
		if (data.success) {
			navigate(`/packages/${pkg?.product_id}`);
		} else {
			setError(data.error || 'Failed to update inventory');
			setSubmitting(false);
		}
	};

	if (loading) return <div className="max-w-2xl mx-auto px-4 py-8"><p className="text-sm text-gray-500">Loading...</p></div>;
	if (!pkg) return null;

	return (
		<div className="bg-gray-50 font-sans text-gray-900 min-h-screen flex flex-col">
			<div className="max-w-2xl mx-auto px-6 py-8 flex-1 w-full">
				<Link to={`/packages/${pkg.product_id}`} className="inline-flex items-center gap-1.5 text-[0.8125rem] text-gray-500 hover:text-gray-700 transition-colors no-underline mb-6">
					← Back to product
				</Link>
				<div className="mb-6">
					<h1 className="text-xl font-semibold tracking-tight text-gray-900">Adjust Quantity</h1>
					<p className="text-sm text-gray-500 font-light mt-0.5">{productName}{pkg.lot_number ? ` — Lot ${pkg.lot_number}` : ''}</p>
				</div>

				{error && (
					<div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-[0.8125rem] text-red-700">{error}</div>
				)}

				<div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
					<form onSubmit={handleSubmit}>

						{/* Package Info */}
						<div className="px-6 py-5 border-b border-gray-100">
							<div className="text-[0.7rem] font-mono text-gray-500 uppercase tracking-[0.08em] mb-4">Package Info</div>
							<div className="grid grid-cols-3 gap-4">
								<div>
									<div className="text-[0.7rem] font-mono text-gray-500 uppercase tracking-[0.06em] mb-1">Brand</div>
									<div className="text-[0.875rem] font-medium text-gray-800">{brand?.name || '—'}</div>
								</div>
								<div>
									<div className="text-[0.7rem] font-mono text-gray-500 uppercase tracking-[0.06em] mb-1">Strain</div>
									<div className="text-[0.875rem] font-medium text-gray-800">{strain?.name || '—'}</div>
								</div>
								<div>
									<div className="text-[0.7rem] font-mono text-gray-500 uppercase tracking-[0.06em] mb-1">Category</div>
									<div className="text-[0.875rem] font-medium text-gray-800">{category?.name || '—'}</div>
								</div>
							</div>
						</div>

						{/* Adjustment */}
						<div className="px-6 py-5 border-b border-gray-100">
							<div className="text-[0.7rem] font-mono text-gray-500 uppercase tracking-[0.08em] mb-4">Adjustment</div>
							<div className="space-y-4">
								<div className="grid grid-cols-2 gap-4">
									<div>
										<label className="block text-[0.8125rem] font-medium text-gray-700 mb-1.5">
											Quantity <span className="text-red-400">*</span>
										</label>
										<input
											type="number"
											value={form.quantity}
											onChange={set('quantity')}
											step="0.001"
											min="0"
											required
											className="w-full px-3 py-2 text-[0.875rem] border border-gray-300 rounded-md bg-white"
										/>
									</div>
									<div>
										<label className="block text-[0.8125rem] font-medium text-gray-700 mb-1.5">Unit</label>
										<input
											type="text"
											value={pkg.unit}
											disabled
											className="w-full px-3 py-2 text-[0.875rem] border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
										/>
									</div>
								</div>
								<div>
									<label className="block text-[0.8125rem] font-medium text-gray-700 mb-1.5">
										Cost Price <span className="text-red-400">*</span>
									</label>
									<div className="relative">
										<span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-[0.875rem]">$</span>
										<input
											type="number"
											value={form.cost_price_unit}
											onChange={set('cost_price_unit')}
											step="0.01"
											min="0"
											required
											className="w-full pl-12 pr-3 py-2 text-[0.875rem] border border-gray-300 rounded-md bg-white"
										/>
									</div>
								</div>
								<div>
									<label className="block text-[0.8125rem] font-medium text-gray-700 mb-1.5">
										Reason <span className="text-red-400">*</span>
									</label>
									<select
										value={form.movement_type}
										onChange={set('movement_type')}
										required
										className="w-full px-3 py-2 text-[0.875rem] border border-gray-300 rounded-md bg-white text-gray-700"
									>
										<option value="">— Select a reason —</option>
										{adjustmentReasons.map(r => <option key={r} value={r}>{r}</option>)}
									</select>
								</div>
								<div>
									<label className="block text-[0.8125rem] font-medium text-gray-700 mb-1.5">Status</label>
									<select
										value={form.status}
										onChange={set('status')}
										className="w-full px-3 py-2 text-[0.875rem] border border-gray-300 rounded-md bg-white text-gray-700"
									>
										{statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
									</select>
								</div>
								<div>
									<label className="block text-[0.8125rem] font-medium text-gray-700 mb-1.5">
										Notes <span className="text-[0.75rem] text-gray-500 font-light ml-1">optional</span>
									</label>
									<textarea
										value={form.notes}
										onChange={set('notes')}
										rows={3}
										placeholder="Additional notes..."
										className="w-full px-3 py-2 text-[0.875rem] border border-gray-300 rounded-md resize-none bg-white placeholder-gray-300"
									/>
								</div>
							</div>
						</div>

						{/* Actions */}
						<div className="px-6 py-4 bg-gray-50 flex items-center justify-between gap-3">
							<Link
								to={`/packages/${pkg.product_id}`}
								className="inline-flex items-center justify-center px-4 py-[0.4rem] text-[0.8125rem] font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-white hover:border-gray-400 transition-colors no-underline"
							>
								Cancel
							</Link>
							<button
								type="submit"
								disabled={submitting}
								className="inline-flex items-center justify-center px-5 py-[0.4rem] text-[0.8125rem] font-medium text-white bg-green-mid border border-green-mid rounded-md hover:bg-green-deep hover:border-green-deep transition-colors cursor-pointer disabled:opacity-50"
							>
								{submitting ? 'Updating...' : 'Update Quantity'}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default AdjustInventory;
