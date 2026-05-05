import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import type { Location } from '../../types/location';

interface ProductInfo {
	id: number;
	name: string;
	unit: string;
	brand_id: number | null;
	strain_id: number | null;
	category_id: number | null;
}

interface RelatedInfo {
	name: string;
}

interface FormData {
	packageTag: string;
	batch: string;
	location_id: string;
	quantity: string;
	unit: string;
	unit_price: string;
	package_size: string;
	vendor: string;
	notes: string;
	reason: string;
}

const ReceiveInventory = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [product, setProduct] = useState<ProductInfo | null>(null);
	const [brand, setBrand] = useState<RelatedInfo | null>(null);
	const [strain, setStrain] = useState<RelatedInfo | null>(null);
	const [category, setCategory] = useState<RelatedInfo | null>(null);
	const [locations, setLocations] = useState<Location[]>([]);
	const [units, setUnits] = useState<string[]>([]);
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState('');

	const [form, setForm] = useState<FormData>({
		packageTag: '', batch: '', location_id: '',
		quantity: '', unit: '', unit_price: '', package_size: '',
		vendor: '', notes: '', reason: 'Receive',
	});

	useEffect(() => {
		const fetchData = async () => {
			const res = await fetch(`/api/packages/${id}/receive`);
			if (!res.ok) { navigate('/packages'); return; }
			const data = await res.json();
			setProduct(data.product);
			setBrand(data.brand);
			setStrain(data.strain);
			setCategory(data.category);
			setLocations(data.locations);
			setUnits(data.units);
			setForm(prev => ({ ...prev, unit: data.product.unit }));
			setLoading(false);
		};
		fetchData();
	}, [id, navigate]);

	const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
		setForm(prev => ({ ...prev, [field]: e.target.value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitting(true);
		setError('');
		const res = await fetch(`/api/packages/${id}/receive`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ ...form, package_tag: form.packageTag }),
		});
		const data = await res.json();
		if (data.success) {
			navigate(`/packages/${id}`);
		} else {
			setError(data.error || 'Failed to receive inventory');
			setSubmitting(false);
		}
	};

	if (loading) return <div className="max-w-2xl mx-auto px-4 py-8"><p className="text-sm text-gray-500">Loading...</p></div>;
	if (!product) return null;

	return (
		<div className="bg-gray-50 font-sans text-gray-900 min-h-screen flex flex-col">
			<div className="max-w-2xl mx-auto px-6 py-8 flex-1 w-full">
				<Link to={`/packages/${id}`} className="inline-flex items-center gap-1.5 text-[0.8125rem] text-gray-500 hover:text-gray-700 transition-colors no-underline mb-6">
					← Back to product
				</Link>
				<div className="mb-6">
					<h1 className="text-xl font-semibold tracking-tight text-gray-900">Receive Inventory</h1>
					<p className="text-sm text-gray-500 font-light mt-0.5">{product.name}</p>
				</div>

				{error && (
					<div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-[0.8125rem] text-red-700">{error}</div>
				)}

				<div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
					<form onSubmit={handleSubmit}>

						{/* Product Info */}
						<div className="px-6 py-5 border-b border-gray-100">
							<div className="text-[0.7rem] font-mono text-gray-500 uppercase tracking-[0.08em] mb-4">Product Info</div>
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

						{/* Package Details */}
						<div className="px-6 py-5 border-b border-gray-100">
							<div className="text-[0.7rem] font-mono text-gray-500 uppercase tracking-[0.08em] mb-4">Package Details</div>
							<div className="space-y-4">
								<div>
									<label className="block text-[0.8125rem] font-medium text-gray-700 mb-1.5">
										Package Tag <span className="text-red-400">*</span>
									</label>
									<input
										type="text"
										value={form.packageTag}
										onChange={set('packageTag')}
										placeholder="e.g. 1A4060300003B01000000001"
										required
										className="w-full px-3 py-2 text-[0.875rem] font-mono border border-gray-300 rounded-md bg-white placeholder-gray-300"
									/>
								</div>
								<div>
									<label className="block text-[0.8125rem] font-medium text-gray-700 mb-1.5">
										Batch Number <span className="text-red-400">*</span>
									</label>
									<input
										type="text"
										value={form.batch}
										onChange={set('batch')}
										placeholder="e.g. CCK091827"
										required
										className="w-full px-3 py-2 text-[0.875rem] font-mono border border-gray-300 rounded-md bg-white placeholder-gray-300"
									/>
								</div>
								<div>
									<label className="block text-[0.8125rem] font-medium text-gray-700 mb-1.5">
										Location <span className="text-red-400">*</span>
									</label>
									<select
										value={form.location_id}
										onChange={set('location_id')}
										required
										className="w-full px-3 py-2 text-[0.875rem] border border-gray-300 rounded-md bg-white text-gray-700"
									>
										<option value="">— Select location —</option>
										{locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
									</select>
								</div>
							</div>
						</div>

						{/* Quantity */}
						<div className="px-6 py-5 border-b border-gray-100">
							<div className="text-[0.7rem] font-mono text-gray-500 uppercase tracking-[0.08em] mb-4">Quantity</div>
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
										<select
											value={form.unit}
											onChange={e => {
												const next = e.target.value;
												setForm(prev => ({ ...prev, unit: next, package_size: next !== 'each' ? '' : prev.package_size }));
											}}
											className="w-full px-3 py-2 text-[0.875rem] border border-gray-300 rounded-md bg-white text-gray-700"
										>
											{units.map(u => <option key={u} value={u}>{u}</option>)}
										</select>
									</div>
								</div>
								<div>
									<label className="block text-[0.8125rem] font-medium text-gray-700 mb-1.5">
										Cost per Unit <span className="text-red-400">*</span>
									</label>
									<div className="relative">
										<span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-[0.875rem]">$</span>
										<input
											type="number"
											value={form.unit_price}
											onChange={set('unit_price')}
											step="0.01"
											min="0"
											required
											className="w-full pl-12 pr-3 py-2 text-[0.875rem] border border-gray-300 rounded-md bg-white"
										/>
									</div>
								</div>
								{form.unit === 'each' && (
								<div>
									<label className="block text-[0.8125rem] font-medium text-gray-700 mb-1.5">
										Package Size <span className="text-[0.75rem] text-gray-500 font-light ml-1">optional</span>
									</label>
									<input
										type="number"
										value={form.package_size}
										onChange={set('package_size')}
										step="0.001"
										min="0"
										placeholder="e.g. 3.5"
										className="w-full px-3 py-2 text-[0.875rem] border border-gray-300 rounded-md bg-white placeholder-gray-300"
									/>
								</div>
							)}
							</div>
						</div>

						{/* Additional */}
						<div className="px-6 py-5 border-b border-gray-100">
							<div className="text-[0.7rem] font-mono text-gray-500 uppercase tracking-[0.08em] mb-4">Additional</div>
							<div className="space-y-4">
								<div>
									<label className="block text-[0.8125rem] font-medium text-gray-700 mb-1.5">
										Vendor <span className="text-[0.75rem] text-gray-500 font-light ml-1">optional</span>
									</label>
									<input
										type="text"
										value={form.vendor}
										onChange={set('vendor')}
										className="w-full px-3 py-2 text-[0.875rem] border border-gray-300 rounded-md bg-white"
									/>
								</div>
								<div>
									<label className="block text-[0.8125rem] font-medium text-gray-700 mb-1.5">
										Notes <span className="text-[0.75rem] text-gray-500 font-light ml-1">optional</span>
									</label>
									<textarea
										value={form.notes}
										onChange={set('notes')}
										rows={3}
										className="w-full px-3 py-2 text-[0.875rem] border border-gray-300 rounded-md resize-none bg-white"
									/>
								</div>
							</div>
						</div>

						{/* Actions */}
						<div className="px-6 py-4 bg-gray-50 flex items-center justify-between gap-3">
							<Link
								to={`/packages/${id}`}
								className="inline-flex items-center justify-center px-4 py-[0.4rem] text-[0.8125rem] font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-white hover:border-gray-400 transition-colors no-underline"
							>
								Cancel
							</Link>
							<button
								type="submit"
								disabled={submitting}
								className="inline-flex items-center justify-center px-5 py-[0.4rem] text-[0.8125rem] font-medium text-white bg-green-mid border border-green-mid rounded-md hover:bg-green-deep hover:border-green-deep transition-colors cursor-pointer disabled:opacity-50"
							>
								{submitting ? 'Receiving...' : 'Receive Inventory'}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default ReceiveInventory;
