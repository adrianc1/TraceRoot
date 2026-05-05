import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../../types/product';

const ProductList = () => {
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const [status, setStatus] = useState<'active' | 'archived'>('active');

	useEffect(() => {
		const fetchProducts = async () => {
			setLoading(true);
			const response = await fetch(`/api/packages/products?status=${status}`);
			const data = await response.json();
			setProducts(data.products);
			setLoading(false);
		};
		fetchProducts();
	}, [status]);

	return (
		<div className="bg-gray-50 font-sans text-gray-900 min-h-screen flex flex-col">
			<div className="max-w-6xl mx-auto px-4 py-8 flex-1 w-full">

				{/* Page header */}
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
					<div>
						<h1 className="text-xl font-semibold tracking-tight text-gray-900">Products</h1>
						<p className="text-sm text-gray-500 font-light mt-0.5">
							{!loading && `${products.length} product${products.length !== 1 ? 's' : ''} in your catalog`}
						</p>
					</div>
					<div className="flex flex-row items-center gap-2">
						<a
							href="/api/packages/products/export"
							className="inline-flex items-center justify-center whitespace-nowrap px-4 py-[0.4rem] text-[0.8125rem] font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 transition-colors no-underline"
						>
							Export CSV
						</a>
						<Link
							to="/packages/create-product"
							className="inline-flex items-center justify-center px-4 py-[0.4rem] text-[0.8125rem] font-medium text-white bg-green-mid border border-green-mid rounded-md hover:bg-green-deep hover:border-green-deep transition-colors no-underline"
						>
							+ New Product
						</Link>
					</div>
				</div>

				{/* Tabs */}
				<div className="flex gap-1 mb-4 border-b border-gray-200">
					<button
						onClick={() => setStatus('active')}
						className={`px-4 py-2 text-[0.8125rem] font-medium border-b-2 transition-colors -mb-px ${
							status === 'active'
								? 'border-green-mid text-green-mid'
								: 'border-transparent text-gray-500 hover:text-gray-700'
						}`}
					>
						Active
					</button>
					<button
						onClick={() => setStatus('archived')}
						className={`px-4 py-2 text-[0.8125rem] font-medium border-b-2 transition-colors -mb-px ${
							status === 'archived'
								? 'border-green-mid text-green-mid'
								: 'border-transparent text-gray-500 hover:text-gray-700'
						}`}
					>
						Archived
					</button>
				</div>

				{/* Table card */}
				<div className="bg-white border border-gray-200 rounded-xl overflow-x-auto">
					{loading ? (
						<div className="py-8 text-center">
							<p className="text-sm text-gray-500">Loading...</p>
						</div>
					) : products.length === 0 ? (
						<div className="px-6 py-16 text-center flex flex-col items-center gap-4">
							<img src="/tracerootlogo.png" alt="Traceroot" className="w-48 opacity-80" />
							{status === 'archived' ? (
								<p className="text-[0.875rem] text-gray-500">No archived products.</p>
							) : (
								<>
									<p className="text-[0.875rem] text-gray-500">No products yet.</p>
									<Link
										to="/packages/create-product"
										className="inline-flex items-center justify-center px-4 py-[0.4rem] text-[0.8125rem] font-medium text-white bg-green-mid border border-green-mid rounded-md hover:bg-green-deep transition-colors no-underline"
									>
										Create your first product
									</Link>
								</>
							)}
						</div>
					) : (
						<table className="w-full">
							<thead>
								<tr className="border-b border-gray-100">
									<th className="px-6 py-3 text-left text-[0.7rem] font-mono text-gray-500 uppercase tracking-[0.08em]">Name</th>
									<th className="px-6 py-3 text-left text-[0.7rem] font-mono text-gray-500 uppercase tracking-[0.08em]">Brand</th>
									<th className="px-6 py-3 text-left text-[0.7rem] font-mono text-gray-500 uppercase tracking-[0.08em]">Category</th>
									<th className="px-6 py-3 text-left text-[0.7rem] font-mono text-gray-500 uppercase tracking-[0.08em]">Strain</th>
									<th className="px-6 py-3 text-right text-[0.7rem] font-mono text-gray-500 uppercase tracking-[0.08em]">On Hand</th>
									<th className="px-6 py-3 text-right text-[0.7rem] font-mono text-gray-500 uppercase tracking-[0.08em]">Avg Cost</th>
									<th className="px-6 py-3 text-left text-[0.7rem] font-mono text-gray-500 uppercase tracking-[0.08em]">Status</th>
									<th className="px-6 py-3 text-right text-[0.7rem] font-mono text-gray-500 uppercase tracking-[0.08em]">Actions</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-100">
								{products.map((product) => (
									<tr key={product.id} className="hover:bg-gray-50 transition-colors">
										<td className="px-6 py-4 text-[0.875rem] font-medium text-gray-900">
											{product.name}
										</td>
										<td className="px-6 py-4 text-[0.875rem] text-gray-500">{product.brand_name || '—'}</td>
										<td className="px-6 py-4 text-[0.875rem] text-gray-500">{product.category_name || '—'}</td>
										<td className="px-6 py-4 text-[0.875rem] text-gray-500">{product.strain_name || '—'}</td>
										<td className="px-6 py-4 text-[0.875rem] text-gray-900 text-right font-mono">
											{product.product_qty ?? '—'}{product.unit ? ` ${product.unit}` : ''}
										</td>
										<td className="px-6 py-4 text-[0.875rem] text-gray-500 text-right font-mono">
											${product.average_cost && product.average_cost > 0 ? Number(product.average_cost).toFixed(2) : '—'}
										</td>
										<td className="px-6 py-4">
											{product.status === 'archived' ? (
												<span className="inline-flex items-center gap-1 font-mono text-[0.7rem] font-medium px-2 py-[0.2rem] rounded bg-gray-100 text-gray-500">
													<span className="w-1.5 h-1.5 rounded-full bg-current" />
													Archived
												</span>
											) : (
												<span className="inline-flex items-center gap-1 font-mono text-[0.7rem] font-medium px-2 py-[0.2rem] rounded bg-green-light text-green-deep">
													<span className="w-1.5 h-1.5 rounded-full bg-current" />
													Active
												</span>
											)}
										</td>
										<td className="px-6 py-4 text-right">
											<div className="inline-flex items-center gap-2">
												<Link
													to={`/packages/${product.id}`}
													className="inline-flex items-center justify-center px-3 py-[0.35rem] text-[0.8125rem] font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 transition-colors no-underline"
												>
													Packages
												</Link>
												<Link
													to={`/packages/${product.id}/edit`}
													className="inline-flex items-center justify-center px-3 py-[0.35rem] text-[0.8125rem] font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 transition-colors no-underline"
												>
													Edit
												</Link>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					)}
				</div>
			</div>
		</div>
	);
};

export default ProductList;
