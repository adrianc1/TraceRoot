import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import type { Category } from '../../types/category';
import type { Product } from '../../types/product';

const CategoryProducts = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [category, setCategory] = useState<Category | null>(null);
	const [products, setProducts] = useState<Product[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			const [categoryRes, productsRes] = await Promise.all([
				fetch(`/api/categories/${id}`),
				fetch(`/api/categories/${id}/products`),
			]);
			const categoryData = await categoryRes.json();
			const productsData = await productsRes.json();
			setCategory(categoryData);
			setProducts(productsData);
		};
		fetchData();
	}, [id]);

	const handleDelete = async () => {
		if (!confirm('Delete this category?')) return;
		const response = await fetch(`/api/categories/${id}`, {
			method: 'DELETE',
		});
		if (response.ok) {
			navigate('/categories');
		}
	};

	if (!category) return <div>Loading...</div>;

	return (
		<div className="bg-gray-50 font-sans text-gray-900 min-h-screen flex flex-col">
			<div className="max-w-4xl mx-auto px-6 py-8 flex-1 w-full">
				<Link
					to="/categories"
					className="inline-flex items-center gap-1.5 text-[0.8125rem] text-gray-400 hover:text-gray-700 transition-colors no-underline mb-6"
				>
					← Back to categories
				</Link>

				<div className="flex items-center justify-between mb-6">
					<div>
						<h1 className="text-xl font-semibold tracking-tight text-gray-900">
							{category.name}
						</h1>
						<p className="text-sm text-gray-400 font-light mt-0.5">
							{products.length} product{products.length !== 1 ? 's' : ''} in this category
						</p>
					</div>
					<div className="flex items-center gap-2">
						<button
							onClick={handleDelete}
							className="inline-flex items-center justify-center px-4 py-[0.4rem] text-[0.8125rem] font-medium text-red-700 border border-red-200 rounded-md hover:bg-red-50 hover:border-red-300 transition-colors cursor-pointer bg-white"
						>
							Delete
						</button>
						<Link
							to={`/categories/${id}/edit`}
							className="inline-flex items-center justify-center px-4 py-[0.4rem] text-[0.8125rem] font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 transition-colors no-underline"
						>
							Edit
						</Link>
					</div>
				</div>

				<div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
					{products.length === 0 ? (
						<div className="px-6 py-12 text-center">
							<p className="text-[0.875rem] text-gray-400">
								No products in this category yet.
							</p>
							<a
								href="/packages/create-product"
								className="text-[0.875rem] text-green-mid hover:text-green-deep mt-1 inline-block"
							>
								Add a product →
							</a>
						</div>
					) : (
						<table className="w-full">
							<thead>
								<tr className="border-b border-gray-100">
									<th className="px-6 py-3 text-left text-[0.7rem] font-mono text-gray-400 uppercase tracking-[0.08em]">
										Name
									</th>
									<th className="px-6 py-3 text-left text-[0.7rem] font-mono text-gray-400 uppercase tracking-[0.08em]">
										Brand
									</th>
									<th className="px-6 py-3 text-left text-[0.7rem] font-mono text-gray-400 uppercase tracking-[0.08em]">
										Strain
									</th>
									<th className="px-6 py-3 text-left text-[0.7rem] font-mono text-gray-400 uppercase tracking-[0.08em]">
										Status
									</th>
									<th className="px-6 py-3 text-right text-[0.7rem] font-mono text-gray-400 uppercase tracking-[0.08em]">
										Quantity
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-100">
								{products.map((product) => (
									<tr
										key={product.id}
										className="hover:bg-gray-50 transition-colors"
									>
										<td className="px-6 py-4">
											<a
												href={`/packages/${product.id}`}
												className="text-[0.875rem] font-medium text-green-mid hover:text-green-deep transition-colors no-underline"
											>
												{product.name}
											</a>
										</td>
										<td className="px-6 py-4 text-[0.875rem] text-gray-500">
											{product.brand_name ?? '—'}
										</td>
										<td className="px-6 py-4 text-[0.875rem] text-gray-500">
											{product.strain_name ?? '—'}
										</td>
										<td className="px-6 py-4">
											{product.status === 'active' ? (
												<span className="inline-flex items-center px-2 py-0.5 rounded-full text-[0.75rem] font-medium bg-green-light text-green-deep">
													Active
												</span>
											) : (
												<span className="inline-flex items-center px-2 py-0.5 rounded-full text-[0.75rem] font-medium bg-gray-100 text-gray-500">
													Archived
												</span>
											)}
										</td>
										<td className="px-6 py-4 text-right text-[0.875rem] font-medium text-gray-900">
											{product.total_quantity ?? 0}{' '}
											<span className="text-gray-400 font-normal">
												{product.unit}
											</span>
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

export default CategoryProducts;
