import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Strain } from '../../types/strain';

const Strains = () => {
	const [strains, setStrains] = useState<Strain[]>([]);
	useEffect(() => {
		const fetchStrains = async () => {
			const response = await fetch('/api/strains');
			const data = await response.json();
			setStrains(data);
		};
		fetchStrains();
	}, []);

	return (
		<div className="bg-gray-50 font-sans text-gray-900 min-h-screen overflow-x-hidden flex flex-col">
			<div className="max-w-7xl mx-auto px-6 py-8 flex-1 w-full">
				{/* <!-- Page header --> */}
				<div className="flex items-center justify-between mb-6">
					<div>
						<h1 className="text-xl font-semibold tracking-tight text-gray-900">
							Strains
						</h1>
						<p className="text-sm text-gray-500 font-light mt-0.5">
							{strains.length} {strains.length !== 1 ? 'strains' : 'strain'} in
							your company
						</p>
					</div>
					<Link
						to="/strains/create"
						className="inline-flex items-center justify-center whitespace-nowrap px-4 py-[0.4rem] text-[0.8125rem] font-medium text-white bg-green-mid border border-green-mid rounded-md hover:bg-green-deep hover:border-green-deep transition-colors no-underline"
					>
						+ New Strain
					</Link>
				</div>

				{/* <!-- Table card --> */}
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
								{strains.map((strain: Strain) => (
									<tr
										className="hover:bg-gray-50 transition-colors"
										key={strain.id}
									>
										<td className="px-4 py-3">
											<Link
												to={`/strains/${strain.id}`}
												className="text-[0.8125rem] font-medium text-gray-900 hover:text-green-mid transition-colors no-underline"
											>
												{strain.name}
											</Link>
										</td>
										<td className="hidden md:table-cell px-4 py-3 text-[0.8125rem] text-gray-500">
											{strain.description || ''}
										</td>
										<td className="px-4 py-3 text-right">
											<Link
												to={`/strains/${strain.id}/edit`}
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

					{/* if there are no strains display the logo */}

					{strains.length === 0 && (
						<div className="py-16 text-center">
							<img
								src="/tracerootlogo.png"
								alt="Traceroot"
								className="w-48 opacity-80 mx-auto mb-3"
							/>
							<p className="text-sm font-medium text-gray-500">
								No strains yet
							</p>
							<p className="text-xs text-gray-400 mt-1 mb-4">
								Create your first strain to get started
							</p>
							<Link
								to="/strains/create"
								className="inline-flex items-center justify-center px-4 py-[0.4rem] text-[0.8125rem] font-medium text-white bg-green-mid border border-green-mid rounded-md hover:bg-green-deep transition-colors no-underline"
							>
								New Strain
							</Link>
						</div>
					)}

					{/* table footer */}
					{strains.length > 0 && (
						<div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
							<span className="font-mono text-[0.72rem] text-gray-400">
								<span className="text-gray-600 font-medium">
									{strains.length}
								</span>{' '}
								categor{strains.length !== 1 ? 'ies' : 'y'}
							</span>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Strains;
