import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import type { Brand } from '../../types/brand';
import type { Category } from '../../types/category';
import type { Strain } from '../../types/strain';

interface FormData {
	name: string;
	sku: string;
	description: string;
	unit: string;
	brandId: string;
	categoryId: string;
	strainId: string;
}

const EditProduct = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [brands, setBrands] = useState<Brand[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [strains, setStrains] = useState<Strain[]>([]);
	const [units, setUnits] = useState<string[]>([]);
	const [hasPackages, setHasPackages] = useState(false);
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState('');

	const [form, setForm] = useState<FormData>({
		name: '', sku: '', description: '', unit: '',
		brandId: '', categoryId: '', strainId: '',
	});

	useEffect(() => {
		const fetchData = async () => {
			const res = await fetch(`/api/packages/${id}/edit`);
			if (!res.ok) { navigate('/packages'); return; }
			const data = await res.json();
			const p = data.product;
			setForm({
				name: p.name || '',
				sku: p.sku || '',
				description: p.description || '',
				unit: p.unit || '',
				brandId: p.brand_id ? String(p.brand_id) : '',
				categoryId: p.category_id ? String(p.category_id) : '',
				strainId: p.strain_id ? String(p.strain_id) : '',
			});
			setBrands(data.brands);
			setCategories(data.categories);
			setStrains(data.strains);
			setUnits(data.units);
			setHasPackages(data.hasPackages);
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
		const res = await fetch(`/api/packages/${id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(form),
		});
		const data = await res.json();
		if (data.success) {
			navigate(`/packages/${id}`);
		} else {
			setError(data.error || 'Failed to update product');
			setSubmitting(false);
		}
	};

	if (loading) return <div className="max-w-2xl mx-auto px-4 py-8"><p className="text-sm text-gray-500">Loading...</p></div>;

	return (
		<div className="bg-gray-50 font-sans text-gray-900 min-h-screen flex flex-col">
			<div className="max-w-2xl mx-auto px-4 py-8 flex-1 w-full">
				<Link to={`/packages/${id}`} className="inline-flex items-center gap-1.5 text-[0.8125rem] text-gray-500 hover:text-gray-700 transition-colors no-underline mb-6">
					← Back to product
				</Link>
				<div className="mb-6">
					<h1 className="text-xl font-semibold tracking-tight text-gray-900">Edit Product</h1>
					<p className="text-sm text-gray-500 font-light mt-0.5">Update product details</p>
				</div>

				{error && (
					<div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-[0.8125rem] text-red-700">{error}</div>
				)}

				<div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
					<form onSubmit={handleSubmit}>

						{/* Basic Info */}
						<div className="px-6 py-5 border-b border-gray-100">
							<div className="text-[0.7rem] font-mono text-gray-500 uppercase tracking-[0.08em] mb-4">Basic Info</div>
							<div className="space-y-4">
								<div>
									<label className="block text-[0.8125rem] font-medium text-gray-700 mb-1.5">
										Product Name <span className="text-red-400">*</span>
									</label>
									<input
										type="text"
										value={form.name}
										onChange={set('name')}
										required
										className="w-full px-3 py-2 text-[0.875rem] border border-gray-300 rounded-md bg-white"
									/>
								</div>
								<div>
									<label className="block text-[0.8125rem] font-medium text-gray-700 mb-1.5">
										SKU <span className="text-red-400">*</span>
									</label>
									<input
										type="text"
										value={form.sku}
										onChange={set('sku')}
										required
										className="w-full px-3 py-2 text-[0.875rem] font-mono border border-gray-300 rounded-md bg-white"
									/>
								</div>
								<div>
									<label className="block text-[0.8125rem] font-medium text-gray-700 mb-1.5">Description</label>
									<textarea
										value={form.description}
										onChange={set('description')}
										rows={3}
										className="w-full px-3 py-2 text-[0.875rem] border border-gray-300 rounded-md resize-none bg-white"
									/>
								</div>
								<div className="w-1/2">
									<label className="block text-[0.8125rem] font-medium text-gray-700 mb-1.5">
										Unit of Measure <span className="text-red-400">*</span>
									</label>
									<select
										value={form.unit}
										onChange={set('unit')}
										required
										disabled={hasPackages}
										className="w-full px-3 py-2 text-[0.875rem] border border-gray-300 rounded-md bg-white text-gray-700 disabled:bg-gray-50 disabled:text-gray-500"
									>
										<option value="">— Select unit —</option>
										{units.map(u => <option key={u} value={u}>{u}</option>)}
									</select>
									{hasPackages && (
										<p className="text-[0.75rem] text-gray-500 mt-1">Unit cannot be changed after inventory is received</p>
									)}
								</div>
							</div>
						</div>

						{/* Classification */}
						<div className="px-6 py-5 border-b border-gray-100">
							<div className="text-[0.7rem] font-mono text-gray-500 uppercase tracking-[0.08em] mb-4">Classification</div>
							<div className="space-y-4">
								<div>
									<label className="block text-[0.8125rem] font-medium text-gray-700 mb-1.5">Brand</label>
									<select
										value={form.brandId}
										onChange={set('brandId')}
										className="w-full px-3 py-2 text-[0.875rem] border border-gray-300 rounded-md bg-white text-gray-700"
									>
										<option value="">— Select a brand —</option>
										{brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
									</select>
								</div>
								<div>
									<label className="block text-[0.8125rem] font-medium text-gray-700 mb-1.5">Category</label>
									<select
										value={form.categoryId}
										onChange={set('categoryId')}
										className="w-full px-3 py-2 text-[0.875rem] border border-gray-300 rounded-md bg-white text-gray-700"
									>
										<option value="">— Select a category —</option>
										{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
									</select>
								</div>
								<div>
									<label className="block text-[0.8125rem] font-medium text-gray-700 mb-1.5">
										Strain <span className="text-[0.75rem] text-gray-500 font-light ml-1">optional</span>
									</label>
									<select
										value={form.strainId}
										onChange={set('strainId')}
										className="w-full px-3 py-2 text-[0.875rem] border border-gray-300 rounded-md bg-white text-gray-700"
									>
										<option value="">— No strain —</option>
										{strains.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
									</select>
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
								{submitting ? 'Saving...' : 'Save Changes'}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default EditProduct;
