import { useEffect, useState, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import type { Package, PackageStatus } from '../../types/package';
import type { Brand } from '../../types/brand';
import type { Category } from '../../types/category';

const STATUSES = [
	'all',
	'active',
	'inactive',
	'quarantine',
	'expired',
	'damaged',
	'reserved',
] as const;

const STATUS_STYLES: Record<PackageStatus | 'all', string> = {
	all: 'bg-gray-100 text-gray-500',
	active: 'bg-green-50 text-green-700',
	inactive: 'bg-gray-100 text-gray-500',
	quarantine: 'bg-yellow-50 text-yellow-800',
	damaged: 'bg-red-50 text-red-700',
	expired: 'bg-slate-100 text-slate-700',
	reserved: 'bg-blue-50 text-blue-700',
};

function formatCurrency(val: number | string | null): string {
	return Number(val || 0).toFixed(2);
}

function formatQuantity(qty: number | string, unit: string): string {
	const n = Number(qty);
	return unit === 'each'
		? String(Math.floor(n))
		: n.toFixed(3).replace(/\.?0+$/, '');
}

const Packages = () => {
	const [searchParams, setSearchParams] = useSearchParams();

	const status = searchParams.get('status') || 'active';
	const search = searchParams.get('search') || '';
	const brand = searchParams.get('brand') || '';
	const category = searchParams.get('category') || '';
	const sort = searchParams.get('sort') || 'newest';
	const page = parseInt(searchParams.get('page') || '1');

	const [packages, setPackages] = useState<Package[]>([]);
	const [brands, setBrands] = useState<Brand[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [totalPages, setTotalPages] = useState(1);
	const [total, setTotal] = useState(0);
	const [loading, setLoading] = useState(true);

	const [searchInput, setSearchInput] = useState(search);

	const fetchPackages = useCallback(async () => {
		setLoading(true);
		const params = new URLSearchParams({
			status,
			search,
			brand,
			category,
			sort,
			page: String(page),
		});
		const res = await fetch(`/api/packages?${params}`);
		const data = await res.json();
		setPackages(data.packages);
		setBrands(data.brands);
		setCategories(data.categories);
		setTotalPages(data.totalPages);
		setTotal(data.total);
		setLoading(false);
	}, [status, search, brand, category, sort, page]);

	useEffect(() => {
		fetchPackages();
	}, [fetchPackages]);
	useEffect(() => {
		setSearchInput(search);
	}, [search]);

	const navigate = (overrides: Record<string, string> = {}) => {
		const next: Record<string, string> = {
			status,
			search: searchInput,
			brand,
			category,
			sort,
			page: '1',
		};
		Object.assign(next, overrides);
		Object.keys(next).forEach((k) => {
			if (
				!next[k] ||
				(k === 'sort' && next[k] === 'newest') ||
				(k === 'page' && next[k] === '1')
			)
				delete next[k];
		});
		if (!next.status) next.status = 'active';
		setSearchParams(next);
	};

	const pageUrl = (p: number) => {
		const q: Record<string, string> = { status };
		if (search) q.search = search;
		if (brand) q.brand = brand;
		if (category) q.category = category;
		if (sort && sort !== 'newest') q.sort = sort;
		if (p > 1) q.page = String(p);
		return '?' + new URLSearchParams(q).toString();
	};

	return (
		<div className="bg-gray-50 font-sans text-gray-900 min-h-screen flex flex-col">
			<div className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full">
				{/* Page header */}
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
					<div>
						<h1 className="text-xl font-semibold tracking-tight text-gray-900">
							Packages
						</h1>
						<p className="text-sm text-gray-500 font-light mt-0.5">
							All packages across your inventory
						</p>
					</div>
					<div className="flex flex-row items-center gap-2">
						<Link
							to="/packages/create-product"
							className="inline-flex items-center justify-center whitespace-nowrap px-4 py-[0.4rem] text-[0.8125rem] font-medium text-white bg-green-mid border border-green-mid rounded-md hover:bg-green-deep hover:border-green-deep transition-colors no-underline"
						>
							+ Add Product
						</Link>
						<Link
							to="/packages/receive"
							className="inline-flex items-center justify-center whitespace-nowrap px-4 py-[0.4rem] text-[0.8125rem] font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 transition-colors no-underline"
						>
							Receive
						</Link>
						<a
							href={`/api/packages/export?status=${status}&search=${search}&brand=${brand}&category=${category}&sort=${sort}`}
							className="inline-flex items-center justify-center whitespace-nowrap px-4 py-[0.4rem] text-[0.8125rem] font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 transition-colors no-underline"
						>
							Export CSV
						</a>
					</div>
				</div>

				{/* Mobile: dropdown */}
				<div className="sm:hidden mb-4">
					<select
						value={status}
						onChange={(e) => navigate({ status: e.target.value })}
						className="w-full px-3 py-2 text-[0.8125rem] border border-gray-300 rounded-md bg-white text-gray-700"
					>
						{STATUSES.map((s) => (
							<option key={s} value={s}>
								{s.charAt(0).toUpperCase() + s.slice(1)}
							</option>
						))}
					</select>
				</div>

				{/* Desktop: tabs */}
				<div className="hidden sm:flex gap-1 border-b border-gray-200 mb-4">
					{STATUSES.map((s) => (
						<button
							key={s}
							onClick={() => navigate({ status: s })}
							className={`px-4 py-2 text-[0.8125rem] font-medium border-b-2 transition-colors ${status === s ? 'border-green-mid text-green-mid' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
						>
							{s.charAt(0).toUpperCase() + s.slice(1)}
						</button>
					))}
				</div>

				{/* Filter bar */}
				<div className="flex flex-wrap items-center gap-2 mb-4">
					<div className="relative flex-1 min-w-[200px]">
						<svg
							className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
							/>
						</svg>
						<input
							type="text"
							placeholder="Search tag, product, category..."
							value={searchInput}
							onChange={(e) => setSearchInput(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === 'Enter') navigate({ search: searchInput });
							}}
							className="w-full pl-8 pr-3 py-[0.4rem] text-[0.8125rem] border border-gray-300 rounded-md bg-white transition-all"
						/>
					</div>
					<select
						value={brand}
						onChange={(e) => navigate({ brand: e.target.value })}
						className="px-3 py-[0.4rem] text-[0.8125rem] border border-gray-300 rounded-md bg-white text-gray-700"
					>
						<option value="">All Brands</option>
						{brands.map((b) => (
							<option key={b.id} value={b.name}>
								{b.name}
							</option>
						))}
					</select>
					<select
						value={category}
						onChange={(e) => navigate({ category: e.target.value })}
						className="px-3 py-[0.4rem] text-[0.8125rem] border border-gray-300 rounded-md bg-white text-gray-700"
					>
						<option value="">All Categories</option>
						{categories.map((c) => (
							<option key={c.id} value={c.name}>
								{c.name}
							</option>
						))}
					</select>
					<select
						value={sort}
						onChange={(e) => navigate({ sort: e.target.value })}
						className="px-3 py-[0.4rem] text-[0.8125rem] border border-gray-300 rounded-md bg-white text-gray-700"
					>
						<option value="newest">Newest</option>
						<option value="oldest">Oldest</option>
						<option value="qty_asc">Qty: Low → High</option>
						<option value="qty_desc">Qty: High → Low</option>
						<option value="az">A → Z</option>
						<option value="za">Z → A</option>
					</select>
					<button
						onClick={() => navigate({ search: searchInput })}
						className="px-4 py-[0.4rem] text-[0.8125rem] font-medium text-white bg-green-mid border border-green-mid rounded-md hover:bg-green-deep hover:border-green-deep transition-colors"
					>
						Search
					</button>
				</div>

				{/* Table card */}
				<div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
					<div className="overflow-x-auto">
						<table
							className="w-full border-collapse"
							style={{ minWidth: '900px' }}
						>
							<thead>
								<tr className="border-b border-gray-200 bg-gray-50">
									{[
										'Package Tag',
										'Product',
										'Quantity',
										'Brand',
										'Category',
										'Location',
										'Status',
										'Cost',
										'Total Val.',
										'',
									].map((h) => (
										<th
											key={h}
											className="text-left text-[0.7rem] font-medium text-gray-600 uppercase tracking-[0.06em] px-4 py-3"
										>
											{h}
										</th>
									))}
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-100">
								{!loading &&
									packages.map((pkg) => {
										const statusStyle =
											STATUS_STYLES[pkg.status] || STATUS_STYLES.inactive;
										return (
											<tr
												key={pkg.id}
												className="hover:bg-gray-50 transition-colors"
											>
												<td className="px-4 py-3">
													<span className="font-mono text-[0.75rem] text-gray-500">
														{pkg.package_tag}
													</span>
												</td>
												<td className="px-4 py-3">
													<Link
														to={`/packages/${pkg.product_id}`}
														className="text-[0.8125rem] font-medium text-gray-900 hover:text-green-mid transition-colors no-underline"
													>
														{pkg.product_name}
													</Link>
													<div className="font-mono text-[0.7rem] text-gray-500 mt-0.5">
														{pkg.strain_name || '—'}
													</div>
												</td>
												<td className="px-4 py-3">
													<span className="text-[0.8125rem] font-semibold text-gray-900">
														{formatQuantity(pkg.quantity, pkg.unit)}
													</span>
													<span className="text-[0.75rem] text-gray-500 ml-1">
														{pkg.unit || 'each'}
													</span>
												</td>
												<td className="px-4 py-3">
													<span className="text-[0.8125rem] font-medium text-gray-900">
														{pkg.brand_name || '—'}
													</span>
												</td>
												<td className="px-4 py-3">
													{pkg.category_id ? (
														<Link
															to={`/categories/${pkg.category_id}`}
															className="text-[0.8125rem] text-gray-600 hover:text-green-mid transition-colors no-underline"
														>
															{pkg.category_name}
														</Link>
													) : (
														<span className="text-[0.8125rem] text-gray-500">
															—
														</span>
													)}
												</td>
												<td className="px-4 py-3">
													<span className="text-[0.8125rem] text-gray-600">
														{pkg.location || '—'}
													</span>
												</td>
												<td className="px-4 py-3">
													<span
														className={`inline-flex items-center gap-1 font-mono text-[0.7rem] font-medium px-2 py-[0.2rem] rounded capitalize ${statusStyle}`}
													>
														<span className="w-1.5 h-1.5 rounded-full bg-current" />
														{pkg.status}
													</span>
												</td>
												<td className="px-4 py-3 text-[0.8125rem] text-gray-500">
													${formatCurrency(pkg.cost_price)}
												</td>
												<td className="px-4 py-3">
													<span className="text-[0.8125rem] font-semibold text-green-mid">
														$
														{formatCurrency(
															pkg.quantity * (pkg.cost_price || 0),
														)}
													</span>
												</td>
												<td className="px-4 py-3">
													<div className="flex items-center gap-3">
														<Link
															to={`/packages/${pkg.package_tag}/adjust`}
															className="text-[0.75rem] text-gray-500 hover:text-gray-700 transition-colors font-medium no-underline"
														>
															Adjust
														</Link>
														{Number(pkg.quantity) > 0 && (
															<Link
																to={`/packages/${pkg.package_tag}/split`}
																className="text-[0.75rem] text-green-mid hover:text-green-deep transition-colors font-medium no-underline"
															>
																Split
															</Link>
														)}
													</div>
												</td>
											</tr>
										);
									})}
							</tbody>
						</table>
					</div>

					{/* Empty state */}
					{!loading && packages.length === 0 && (
						<div className="py-16 text-center">
							<img
								src="/tracerootlogo.png"
								alt="Traceroot"
								className="w-48 opacity-80 mx-auto mb-3"
							/>
							{status === 'all' || status === 'active' ? (
								<>
									<p className="text-sm font-medium text-gray-500">
										No packages yet
									</p>
									<p className="text-xs text-gray-500 mt-1 mb-4">
										Add a product before receiving inventory
									</p>
									<Link
										to="/packages/create-product"
										className="inline-flex items-center justify-center px-4 py-[0.4rem] text-[0.8125rem] font-medium text-white bg-green-mid border border-green-mid rounded-md hover:bg-green-deep transition-colors no-underline"
									>
										Add product
									</Link>
								</>
							) : (
								<>
									<p className="text-sm font-medium text-gray-500">
										No {status} packages
									</p>
									<p className="text-xs text-gray-500">
										Packages with {status} status will appear here
									</p>
								</>
							)}
						</div>
					)}

					{/* Loading state */}
					{loading && (
						<div className="py-12 text-center">
							<p className="text-sm text-gray-500">Loading...</p>
						</div>
					)}

					{/* Table footer + pagination */}
					{!loading && packages.length > 0 && (
						<div className="px-4 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
							<span className="font-mono text-[0.72rem] text-gray-500">
								<span className="text-gray-600 font-medium">{total}</span>{' '}
								packages
							</span>
							<div className="flex items-center gap-1">
								{page > 1 && (
									<Link
										to={pageUrl(page - 1)}
										className="px-2 py-1 text-[0.75rem] text-gray-500 hover:text-gray-700 font-medium no-underline"
									>
										← Prev
									</Link>
								)}
								{Array.from({ length: totalPages }, (_, i) => i + 1).map(
									(p) => (
										<Link
											key={p}
											to={pageUrl(p)}
											className={`px-2 py-1 text-[0.75rem] rounded no-underline ${p === page ? 'bg-green-mid text-white font-medium' : 'text-gray-500 hover:text-gray-700'}`}
										>
											{p}
										</Link>
									),
								)}
								{page < totalPages && (
									<Link
										to={pageUrl(page + 1)}
										className="px-2 py-1 text-[0.75rem] text-gray-500 hover:text-gray-700 font-medium no-underline"
									>
										Next →
									</Link>
								)}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Packages;
