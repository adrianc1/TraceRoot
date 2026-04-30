import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import type { Package, ProductDetail, AuditPackage, PackageStatus } from '../../types/package';

const STATUS_STYLES: Record<PackageStatus, string> = {
	active:     'bg-green-50 text-green-700',
	inactive:   'bg-gray-100 text-gray-500',
	quarantine: 'bg-yellow-50 text-yellow-800',
	damaged:    'bg-red-50 text-red-700',
	expired:    'bg-slate-100 text-slate-700',
	reserved:   'bg-blue-50 text-blue-700',
};

function formatCurrency(val: number | string | null): string {
	return Number(val || 0).toFixed(2);
}

function formatQuantity(qty: number | string, unit: string): string {
	const n = Number(qty);
	return unit === 'each' ? String(Math.floor(n)) : n.toFixed(3).replace(/\.?0+$/, '');
}

const Product = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();

	const [product, setProduct] = useState<ProductDetail | null>(null);
	const [inventory, setInventory] = useState<Package[]>([]);
	const [auditTrail, setAuditTrail] = useState<AuditPackage[]>([]);
	const [activeTab, setActiveTab] = useState<'inventory' | 'audit'>('inventory');
	const [expandedAudit, setExpandedAudit] = useState<Set<string>>(new Set());
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchProduct = async () => {
			const res = await fetch(`/api/packages/${id}`);
			if (!res.ok) { navigate('/packages'); return; }
			const data = await res.json();
			setProduct(data.product);
			setInventory(data.productInventory);
			setAuditTrail(data.auditTrail);
			setLoading(false);
		};
		fetchProduct();
	}, [id, navigate]);

	const handleArchive = async () => {
		if (!product) return;
		const confirmed = window.confirm(`Archive ${product.name}? It won't appear in active inventory.`);
		if (!confirmed) return;
		const res = await fetch(`/api/packages/${id}/archive`, { method: 'PUT' });
		const data = await res.json();
		if (data.success) setProduct(p => p ? { ...p, status: 'archived' } : p);
		else alert(data.error || 'Failed to archive product');
	};

	const handleUnarchive = async () => {
		if (!product) return;
		const res = await fetch(`/api/packages/${id}/unarchive`, { method: 'PUT' });
		const data = await res.json();
		if (data.success) setProduct(p => p ? { ...p, status: 'active' } : p);
	};

	const toggleAudit = (tag: string) => {
		setExpandedAudit(prev => {
			const next = new Set(prev);
			if (next.has(tag)) {
				next.delete(tag);
			} else {
				next.add(tag);
			}
			return next;
		});
	};

	if (loading) return (
		<div className="max-w-4xl mx-auto px-4 py-8">
			<p className="text-sm text-gray-400">Loading...</p>
		</div>
	);

	if (!product) return null;

	return (
		<div className="bg-gray-50 font-sans text-gray-900 min-h-screen flex flex-col">
			<div className="max-w-4xl mx-auto px-4 py-8 flex-1 w-full">
				<Link
					to="/packages"
					className="inline-flex items-center gap-1.5 text-[0.8125rem] text-gray-400 hover:text-gray-700 transition-colors no-underline mb-6"
				>
					← Back to packages
				</Link>

				{/* Product header card */}
				<div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-4">

					{/* Top bar */}
					<div className="px-6 py-5 border-b border-gray-100 flex items-start justify-between gap-4">
						<div>
							<div className="font-mono text-[0.7rem] text-gray-400 uppercase tracking-[0.08em] mb-1">{product.sku}</div>
							<h1 className="text-xl font-semibold tracking-tight text-gray-900">
								{product.name}
								{product.status === 'archived' && (
									<span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-[0.7rem] font-medium bg-gray-100 text-gray-500 tracking-wide">
										Archived
									</span>
								)}
							</h1>
						</div>
						<div className="flex items-center gap-2 shrink-0">
							{product.status === 'archived' ? (
								<button
									onClick={handleUnarchive}
									className="inline-flex items-center justify-center px-4 py-[0.4rem] text-[0.8125rem] font-medium text-green-700 border border-green-200 rounded-md hover:bg-green-50 transition-colors cursor-pointer bg-white"
								>
									Unarchive
								</button>
							) : (
								<button
									onClick={handleArchive}
									className="inline-flex items-center justify-center px-4 py-[0.4rem] text-[0.8125rem] font-medium text-red-700 border border-red-200 rounded-md hover:bg-red-50 hover:border-red-300 transition-colors cursor-pointer bg-white"
								>
									Archive
								</button>
							)}
							<Link
								to={`/packages/${id}/edit`}
								className="inline-flex items-center justify-center px-4 py-[0.4rem] text-[0.8125rem] font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 transition-colors no-underline"
							>
								Edit
							</Link>
							<Link
								to={`/packages/${id}/receive`}
								className="inline-flex items-center justify-center px-4 py-[0.4rem] text-[0.8125rem] font-medium text-white bg-green-mid border border-green-mid rounded-md hover:bg-green-deep hover:border-green-deep transition-colors no-underline"
							>
								+ Receive
							</Link>
						</div>
					</div>

					{/* Valuation strip */}
					<div className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-100">
						<div className="px-6 py-4">
							<div className="text-[0.7rem] font-mono text-gray-400 uppercase tracking-[0.06em] mb-1">Avg Cost</div>
							<div className="text-[1.25rem] font-semibold tracking-tight text-green-mid">
								${formatCurrency(product.average_cost)}
								<span className="text-[0.8rem] font-normal text-gray-400 ml-1">/ {product.unit}</span>
							</div>
						</div>
						<div className="px-6 py-4">
							<div className="text-[0.7rem] font-mono text-gray-400 uppercase tracking-[0.06em] mb-1">Total Quantity</div>
							<div className="text-[1.25rem] font-semibold tracking-tight text-gray-900">
								{formatQuantity(product.total_quantity, product.unit)}
								<span className="ml-1 text-[0.8rem] font-normal text-gray-400">{product.unit}</span>
							</div>
						</div>
						<div className="px-6 py-4">
							<div className="text-[0.7rem] font-mono text-gray-400 uppercase tracking-[0.06em] mb-1">Total Valuation</div>
							<div className="text-[1.25rem] font-semibold tracking-tight text-green-mid">
								${Number(product.total_valuation || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
							</div>
						</div>
					</div>

					{/* Metadata grid */}
					<div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
						<div className="px-6 py-4">
							<div className="text-[0.7rem] font-mono text-gray-400 uppercase tracking-[0.06em] mb-1">Brand</div>
							<div className="text-[0.875rem] font-medium text-gray-800">{product.brand_name || '—'}</div>
						</div>
						<div className="px-6 py-4">
							<div className="text-[0.7rem] font-mono text-gray-400 uppercase tracking-[0.06em] mb-1">Strain</div>
							<div className="text-[0.875rem] font-medium text-gray-800">{product.strain_name || '—'}</div>
						</div>
						<div className="px-6 py-4">
							<div className="text-[0.7rem] font-mono text-gray-400 uppercase tracking-[0.06em] mb-1">Category</div>
							<div className="text-[0.875rem] font-medium text-gray-800">{product.category_name || '—'}</div>
						</div>
						<div className="px-6 py-4">
							<div className="text-[0.7rem] font-mono text-gray-400 uppercase tracking-[0.06em] mb-1">Unit</div>
							<div className="text-[0.875rem] font-medium text-gray-800">{product.unit}</div>
						</div>
					</div>
				</div>

				{/* Tabs */}
				<div className="flex gap-1 border-b border-gray-200 mb-4">
					<button
						onClick={() => setActiveTab('inventory')}
						className={`px-4 py-2.5 text-[0.8125rem] font-medium border-b-2 -mb-px transition-colors ${activeTab === 'inventory' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-700'}`}
					>
						Packages
					</button>
					<button
						onClick={() => setActiveTab('audit')}
						className={`px-4 py-2.5 text-[0.8125rem] font-medium border-b-2 -mb-px transition-colors ${activeTab === 'audit' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-700'}`}
					>
						Transaction History
					</button>
				</div>

				{/* Inventory tab */}
				{activeTab === 'inventory' && (
					<div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
						<div className="overflow-x-auto">
							<table className="w-full border-collapse">
								<thead>
									<tr className="border-b border-gray-200 bg-gray-50">
										{['Package Tag', 'Location', 'Quantity', 'Cost', 'Total Val.', 'Status', ''].map(h => (
											<th key={h} className="text-left text-[0.7rem] font-medium text-gray-600 uppercase tracking-[0.06em] px-4 py-3">{h}</th>
										))}
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-100">
									{inventory.map(pkg => {
										const statusStyle = STATUS_STYLES[pkg.status] || STATUS_STYLES.inactive;
										return (
											<tr key={pkg.id} className="hover:bg-gray-50 transition-colors">
												<td className="px-4 py-3">
													<span className="font-mono text-[0.75rem] text-gray-500">{pkg.package_tag}</span>
												</td>
												<td className="px-4 py-3 text-[0.8125rem] text-gray-600">{pkg.location || '—'}</td>
												<td className="px-4 py-3">
													<span className="text-[0.8125rem] font-semibold text-gray-900">{formatQuantity(pkg.quantity, product.unit)}</span>
													<span className="text-[0.75rem] text-gray-400 ml-1">{product.unit}</span>
												</td>
												<td className="px-4 py-3 text-[0.8125rem] text-gray-500">${formatCurrency(pkg.cost_price)}</td>
												<td className="px-4 py-3">
													<span className="text-[0.8125rem] font-semibold text-green-mid">
														${formatCurrency(pkg.quantity * (pkg.cost_price || 0))}
													</span>
												</td>
												<td className="px-4 py-3">
													<span className={`inline-flex items-center gap-1 font-mono text-[0.7rem] font-medium px-2 py-[0.2rem] rounded capitalize ${statusStyle}`}>
														<span className="w-1.5 h-1.5 rounded-full bg-current" />
														{pkg.status}
													</span>
												</td>
												<td className="px-4 py-3">
													<div className="flex items-center gap-3">
														<Link to={`/packages/${pkg.package_tag}/adjust`} className="text-[0.75rem] text-gray-500 hover:text-gray-700 transition-colors font-medium no-underline">Adjust</Link>
														{Number(pkg.quantity) > 0 && (
															<Link to={`/packages/${pkg.package_tag}/split`} className="text-[0.75rem] text-green-mid hover:text-green-deep transition-colors font-medium no-underline">Split</Link>
														)}
													</div>
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>
						{inventory.length === 0 && (
							<div className="py-8 text-center">
								<p className="text-sm font-medium text-gray-500">No packages received yet</p>
							</div>
						)}
						{inventory.length > 0 && (
							<div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
								<span className="font-mono text-[0.72rem] text-gray-400">
									<span className="text-gray-600 font-medium">{inventory.length}</span> packages
								</span>
							</div>
						)}
					</div>
				)}

				{/* Audit trail tab */}
				{activeTab === 'audit' && (
					<div>
						<div className="flex items-center justify-between mb-3">
							<div>
								<h2 className="text-[0.875rem] font-semibold text-gray-900">Transaction History</h2>
								<p className="text-[0.8125rem] text-gray-400 font-light mt-0.5">Audit trail of all inventory movements</p>
							</div>
							<a
								href={`/api/packages/${id}/audit/export`}
								className="inline-flex items-center justify-center px-4 py-[0.4rem] text-[0.8125rem] font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 transition-colors no-underline"
							>
								Export CSV
							</a>
						</div>
						<div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
							<div className="overflow-x-auto">
								<table className="w-full border-collapse">
									<thead>
										<tr className="border-b border-gray-200 bg-gray-50">
											<th className="text-left text-[0.7rem] font-medium text-gray-600 uppercase tracking-[0.06em] px-4 py-3">Package Tag</th>
											<th className="text-left text-[0.7rem] font-medium text-gray-600 uppercase tracking-[0.06em] px-4 py-3">Location</th>
											<th className="text-left text-[0.7rem] font-medium text-gray-600 uppercase tracking-[0.06em] px-4 py-3">Current Qty</th>
											<th className="text-left text-[0.7rem] font-medium text-gray-600 uppercase tracking-[0.06em] px-4 py-3">Total Val.</th>
											<th className="text-left text-[0.7rem] font-medium text-gray-600 uppercase tracking-[0.06em] px-4 py-3">Status</th>
											<th className="text-right text-[0.7rem] font-medium text-gray-600 uppercase tracking-[0.06em] px-4 py-3">Audit</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-gray-100">
										{auditTrail.map(pkg => {
											const statusStyle = STATUS_STYLES[pkg.status] || STATUS_STYLES.inactive;
											const expanded = expandedAudit.has(pkg.package_tag);
											return (
												<React.Fragment key={pkg.package_tag}>
													<tr className="hover:bg-gray-50 transition-colors">
														<td className="px-4 py-3">
															<span className="font-mono text-[0.75rem] text-gray-500">{pkg.package_tag}</span>
														</td>
														<td className="px-4 py-3 text-[0.8125rem] text-gray-600">{pkg.location || '—'}</td>
														<td className="px-4 py-3">
															<span className="text-[0.8125rem] font-semibold text-gray-900">
																{pkg.movements.length > 0 ? pkg.movements[0].ending_quantity : '—'}
															</span>
															<span className="text-[0.75rem] text-gray-400 ml-1">{product.unit}</span>
														</td>
														<td className="px-4 py-3">
															<span className="text-[0.8125rem] font-semibold text-green-mid">—</span>
														</td>
														<td className="px-4 py-3">
															<span className={`inline-flex items-center gap-1 font-mono text-[0.7rem] font-medium px-2 py-[0.2rem] rounded capitalize ${statusStyle}`}>
																<span className="w-1.5 h-1.5 rounded-full bg-current" />
																{pkg.status}
															</span>
														</td>
														<td className="px-4 py-3 text-right">
															<button
																onClick={() => toggleAudit(pkg.package_tag)}
																className="inline-flex items-center gap-1 text-[0.75rem] font-medium text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
															>
																<span>{expanded ? 'Hide' : 'View History'}</span>
																<svg className={`h-3.5 w-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
																	<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
																</svg>
															</button>
														</td>
													</tr>
													{expanded && (
														<tr>
															<td colSpan={6} className="px-6 py-4 bg-gray-50/60">
																<div className="border border-gray-200 rounded-lg overflow-hidden">
																	<table className="w-full text-left">
																		<thead>
																			<tr className="border-b border-gray-200 bg-white">
																				{['Timestamp', 'User', 'Type', 'Start', 'Change', 'End', 'Notes'].map(h => (
																					<th key={h} className="text-left text-[0.7rem] font-medium text-gray-600 uppercase tracking-[0.06em] px-4 py-2.5">{h}</th>
																				))}
																			</tr>
																		</thead>
																		<tbody className="divide-y divide-gray-100">
																			{pkg.movements.length > 0 ? pkg.movements.map(mv => (
																				<tr key={mv.id} className="hover:bg-white transition-colors">
																					<td className="px-4 py-2.5 font-mono text-[0.72rem] text-gray-400 whitespace-nowrap">
																						{new Date(mv.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
																					</td>
																					<td className="px-4 py-2.5 text-[0.8125rem] font-medium text-gray-700">{mv.user_name}</td>
																					<td className="px-4 py-2.5 text-[0.8125rem] text-gray-600 capitalize">{mv.movement_type}</td>
																					<td className="px-4 py-2.5 text-right font-mono text-[0.8125rem] text-gray-500">{mv.starting_quantity}</td>
																					<td className={`px-4 py-2.5 text-right font-mono text-[0.8125rem] font-semibold ${mv.quantity > 0 ? 'text-green-mid' : 'text-red-500'}`}>
																						{mv.quantity > 0 ? '+' : ''}{mv.quantity}
																					</td>
																					<td className="px-4 py-2.5 text-right font-mono text-[0.8125rem] font-semibold text-gray-800">{mv.ending_quantity}</td>
																					<td className="px-4 py-2.5 text-[0.8125rem] text-gray-400">{mv.notes || '—'}</td>
																				</tr>
																			)) : (
																				<tr>
																					<td colSpan={7} className="px-4 py-4 text-center text-[0.8125rem] text-gray-400">No transaction history for this package.</td>
																				</tr>
																			)}
																		</tbody>
																	</table>
																</div>
															</td>
														</tr>
													)}
												</React.Fragment>
											);
										})}
									</tbody>
								</table>
							</div>
							{auditTrail.length === 0 && (
								<div className="py-8 text-center">
									<p className="text-sm font-medium text-gray-500">No packages found</p>
								</div>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Product;
