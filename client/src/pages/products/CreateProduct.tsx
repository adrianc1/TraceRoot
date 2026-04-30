import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
	newBrandName: string;
	newCategoryName: string;
	newStrainName: string;
}

const CreateProduct = () => {
	const navigate = useNavigate();
	const [brands, setBrands] = useState<Brand[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [strains, setStrains] = useState<Strain[]>([]);
	const [units, setUnits] = useState<string[]>([]);
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState('');

	const [form, setForm] = useState<FormData>({
		name: '', sku: '', description: '', unit: '',
		brandId: '', categoryId: '', strainId: '',
		newBrandName: '', newCategoryName: '', newStrainName: '',
	});

	useEffect(() => {
		const fetchData = async () => {
			const res = await fetch('/api/packages/create-product');
			const data = await res.json();
			setBrands(data.brands);
			setCategories(data.categories);
			setStrains(data.strains);
			setUnits(data.units);
			setLoading(false);
		};
		fetchData();
	}, []);

	const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
		setForm(prev => ({ ...prev, [field]: e.target.value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitting(true);
		setError('');
		const res = await fetch('/api/packages/create-product', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(form),
		});
		const data = await res.json();
		if (data.success) {
			navigate(`/packages/${data.id}`);
		} else {
			setError(data.error || 'Failed to create product');
			setSubmitting(false);
		}
	};

	if (loading) return <div className="max-w-2xl mx-auto px-4 py-8"><p className="text-sm text-gray-400">Loading...</p></div>;

	return (
		<div className="bg-gray-50 font-sans text-gray-900 min-h-screen flex flex-col">
			<div className="max-w-2xl mx-auto px-4 py-8 flex-1 w-full">
				<Link to="/packages" className="inline-flex items-center gap-1.5 text-[0.8125rem] text-gray-400 hover:text-gray-700 transition-colors no-underline mb-6">
					← Back to packages
				</Link>
				<div className="mb-6">
					<h1 className="text-xl font-semibold tracking-tight text-gray-900">Add New Product</h1>
					<p className="text-sm text-gray-400 font-light mt-0.5">Define a product that packages can be assigned to</p>
				</div>

				{error && (
					<div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-[0.8125rem] text-red-700">{error}</div>
				)}

				<div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
					<form onSubmit={handleSubmit} id="create-product-form">

						{/* Basic Info */}
						<div className="px-6 py-5 border-b border-gray-100">
							<div className="text-[0.7rem] font-mono text-gray-400 uppercase tracking-[0.08em] mb-4">Basic Info</div>
							<div className="space-y-4">
								<div>
									<label className="block text-[0.8125rem] font-medium text-gray-700 mb-1.5">
										Product Name <span className="text-red-400">*</span>
									</label>
									<input
										type="text"
										value={form.name}
										onChange={set('name')}
										placeholder="Cold Fire 1g"
										required
										className="w-full px-3 py-2 text-[0.875rem] border border-gray-300 rounded-md transition-all bg-white placeholder-gray-300"
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
										placeholder="RTD0001"
										required
										className="w-full px-3 py-2 text-[0.875rem] font-mono border border-gray-300 rounded-md transition-all bg-white placeholder-gray-300"
									/>
									<p className="text-[0.75rem] text-gray-400 mt-1">Must be unique within your company</p>
								</div>
								<div>
									<label className="block text-[0.8125rem] font-medium text-gray-700 mb-1.5">Description</label>
									<textarea
										value={form.description}
										onChange={set('description')}
										rows={3}
										placeholder="Flavorful full-spectrum vape pen"
										className="w-full px-3 py-2 text-[0.875rem] border border-gray-300 rounded-md transition-all resize-none bg-white placeholder-gray-300"
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
										className="w-full px-3 py-2 text-[0.875rem] border border-gray-300 rounded-md transition-all bg-white text-gray-700"
									>
										<option value="">— Select unit —</option>
										{units.map(u => <option key={u} value={u}>{u}</option>)}
									</select>
								</div>
							</div>
						</div>

						{/* Classification */}
						<div className="px-6 py-5 border-b border-gray-100">
							<div className="text-[0.7rem] font-mono text-gray-400 uppercase tracking-[0.08em] mb-4">Classification</div>
							<div className="space-y-4">

								{/* Brand */}
								<div>
									<label className="block text-[0.8125rem] font-medium text-gray-700 mb-1.5">
										Brand <span className="text-red-400">*</span>
									</label>
									<select
										value={form.brandId}
										onChange={e => {
											if (e.target.value === '__new__') setForm(p => ({ ...p, brandId: '__new__', newBrandName: '' }));
											else setForm(p => ({ ...p, brandId: e.target.value, newBrandName: '' }));
										}}
										required={!form.newBrandName}
										className="w-full px-3 py-2 text-[0.875rem] border border-gray-300 rounded-md transition-all bg-white text-gray-700"
									>
										<option value="">— Select a brand —</option>
										{brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
										<option value="__new__" className="text-green-700 font-medium">+ Add new brand</option>
									</select>
									{form.brandId === '__new__' && (
										<input
											type="text"
											value={form.newBrandName}
											onChange={set('newBrandName')}
											placeholder="New brand name"
											required
											className="mt-2 w-full px-3 py-2 text-[0.875rem] border border-gray-300 rounded-md bg-white placeholder-gray-300"
										/>
									)}
								</div>

								{/* Category */}
								<div>
									<label className="block text-[0.8125rem] font-medium text-gray-700 mb-1.5">
										Category <span className="text-red-400">*</span>
									</label>
									<select
										value={form.categoryId}
										onChange={e => {
											if (e.target.value === '__new__') setForm(p => ({ ...p, categoryId: '__new__', newCategoryName: '' }));
											else setForm(p => ({ ...p, categoryId: e.target.value, newCategoryName: '' }));
										}}
										required={!form.newCategoryName}
										className="w-full px-3 py-2 text-[0.875rem] border border-gray-300 rounded-md transition-all bg-white text-gray-700"
									>
										<option value="">— Select a category —</option>
										{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
										<option value="__new__" className="text-green-700 font-medium">+ Add new category</option>
									</select>
									{form.categoryId === '__new__' && (
										<input
											type="text"
											value={form.newCategoryName}
											onChange={set('newCategoryName')}
											placeholder="New category name"
											required
											className="mt-2 w-full px-3 py-2 text-[0.875rem] border border-gray-300 rounded-md bg-white placeholder-gray-300"
										/>
									)}
								</div>

								{/* Strain */}
								<div>
									<label className="block text-[0.8125rem] font-medium text-gray-700 mb-1.5">
										Strain
										<span className="text-[0.75rem] text-gray-400 font-light ml-1">optional</span>
									</label>
									<select
										value={form.strainId}
										onChange={e => {
											if (e.target.value === '__new__') setForm(p => ({ ...p, strainId: '__new__', newStrainName: '' }));
											else setForm(p => ({ ...p, strainId: e.target.value, newStrainName: '' }));
										}}
										className="w-full px-3 py-2 text-[0.875rem] border border-gray-300 rounded-md transition-all bg-white text-gray-700"
									>
										<option value="">— Select a strain —</option>
										{strains.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
										<option value="__new__" className="text-green-700 font-medium">+ Add new strain</option>
									</select>
									{form.strainId === '__new__' && (
										<input
											type="text"
											value={form.newStrainName}
											onChange={set('newStrainName')}
											placeholder="New strain name"
											required
											className="mt-2 w-full px-3 py-2 text-[0.875rem] border border-gray-300 rounded-md bg-white placeholder-gray-300"
										/>
									)}
								</div>
							</div>
						</div>

						{/* Actions */}
						<div className="px-6 py-4 bg-gray-50 flex items-center justify-between gap-3">
							<Link
								to="/packages"
								className="inline-flex items-center justify-center px-4 py-[0.4rem] text-[0.8125rem] font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-white hover:border-gray-400 transition-colors no-underline"
							>
								Cancel
							</Link>
							<button
								type="submit"
								disabled={submitting}
								className="inline-flex items-center justify-center px-5 py-[0.4rem] text-[0.8125rem] font-medium text-white bg-green-mid border border-green-mid rounded-md hover:bg-green-deep hover:border-green-deep transition-colors cursor-pointer disabled:opacity-50"
							>
								{submitting ? 'Creating...' : 'Create Product'}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default CreateProduct;
