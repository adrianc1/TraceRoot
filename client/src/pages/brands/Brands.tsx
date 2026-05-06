import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Brand } from '../../types/brand';

const Brands = () => {
	const [brands, setBrands] = useState<Brand[]>([]);

	useEffect(() => {
		const fetchBrands = async () => {
			const response = await fetch('/api/brands');
			const data = await response.json();
			setBrands(data);
		};
		fetchBrands();
	}, []);

	return (
		<div className="max-w-7xl mx-auto px-6 py-8 flex-1 w-full">
			{/* Page header */}
			<div className="flex items-center justify-between mb-6">
				<div>
					<h1 className="text-xl font-semibold tracking-tight text-gray-900">
						Brands
					</h1>
					<p className="text-sm text-gray-500 font-light mt-0.5">
						{brands.length} brand{brands.length !== 1 ? 's' : ''} in your
						company
					</p>
				</div>
				<Link
					to="/brands/create"
					className="inline-flex items-center justify-center whitespace-nowrap px-4 py-[0.4rem] text-[0.8125rem] font-medium text-white bg-green-mid border border-green-mid rounded-md hover:bg-green-deep hover:border-green-deep transition-colors no-underline"
				>
					+ New Brand
				</Link>
			</div>

			{/* Table card */}
			<div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
				<div className="overflow-x-auto">
					<table className="w-full border-collapse">
						<thead>
							<tr className="border-b border-gray-200 bg-gray-50">
								<th className="text-left text-[0.7rem] font-medium text-gray-600 uppercase tracking-[0.06em] px-4 py-3">
									Name
								</th>
								<th className="hidden md:table-cell text-left text-[0.7rem] font-medium text-gray-600 uppercase tracking-[0.06em] px-4 py-3">
									Description
								</th>
								<th className="text-right text-[0.7rem] font-medium text-gray-600 uppercase tracking-[0.06em] px-4 py-3"></th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100">
							{brands.map((brand) => (
								<tr
									key={brand.id}
									className="hover:bg-gray-50 transition-colors"
								>
									<td className="px-4 py-3">
										<span className="text-[0.8125rem] font-medium text-gray-900">
											{brand.name}
										</span>
									</td>
									<td className="hidden md:table-cell px-4 py-3 text-[0.8125rem] text-gray-500">
										{brand.description || ''}
									</td>
									<td className="px-4 py-3 text-right">
										<Link
											to={`/brands/${brand.id}/edit`}
											className="text-[0.75rem] text-gray-500 hover:text-gray-700 transition-colors font-medium no-underline"
										>
											Edit
										</Link>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{/* Empty state */}
				{brands.length === 0 && (
					<div className="py-16 text-center">
						<p className="text-sm font-medium text-gray-500">No brands yet</p>
						<p className="text-xs text-gray-500 mt-1 mb-4">
							Create your first brand to get started
						</p>
						<Link
							to="/brands/create"
							className="inline-flex items-center justify-center px-4 py-[0.4rem] text-[0.8125rem] font-medium text-white bg-green-mid border border-green-mid rounded-md hover:bg-green-deep transition-colors no-underline"
						>
							New Brand
						</Link>
					</div>
				)}

				{/* Table footer */}
				{brands.length > 0 && (
					<div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
						<span className="font-mono text-[0.72rem] text-gray-500">
							<span className="text-gray-600 font-medium">{brands.length}</span>{' '}
							brand{brands.length !== 1 ? 's' : ''}
						</span>
					</div>
				)}
			</div>
		</div>
	);
};

export default Brands;
