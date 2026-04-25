import React from 'react';
import { useNavigate } from 'react-router-dom';
const CreateBrand = () => {
	const navigate = useNavigate();

	const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);

		const response = await fetch('/api/brands', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				name: formData.get('name'),
				description: formData.get('description'),
			}),
		});

		if (response.ok) {
			navigate('/brands');
		} else {
			console.error('Failed to create brand');
		}
	};

	return (
		<div className="bg-gray-50 font-sans text-gray-900 min-h-screen flex flex-col">
			<div className="max-w-2xl mx-auto px-6 py-8 flex-1 w-full">
				{/* backlink */}
				<a
					href="/brands"
					className="inline-flex items-center gap-1.5 text-[0.8125rem] text-gray-400 hover:text-gray-700 transition-colors no-underline mb-6"
				>
					← Back to brands
				</a>

				{/* Page title */}
				<div className="mb-6">
					<h1 className="text-xl font-semibold tracking-tight text-gray-900">
						Add New Brand
					</h1>
					<p className="text-sm text-gray-400 font-light mt-0.5">
						Brands can be assigned to products in your inventory
					</p>
				</div>

				{/* Error partial */}
				{/* <%- include('../partials/errors.ejs') %> */}

				{/* form section    */}
				<div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
					<form id="create-brand-form" onSubmit={handleSubmit}>
						{/* Section: Brand Info */}
						<div className="px-6 py-5 border-b border-gray-100">
							<div className="text-[0.7rem] font-mono text-gray-400 uppercase tracking-[0.08em] mb-4">
								Brand Info
							</div>
							<div className="space-y-4">
								<div>
									<label
										htmlFor="name"
										className="block text-[0.8125rem] font-medium text-gray-700 mb-1.5"
									>
										Brand Name <span className="text-red-400">*</span>
									</label>
									<input
										type="text"
										id="name"
										name="name"
										placeholder="e.g. Jeeter, Raw Garden"
										required
										className="w-full px-3 py-2 text-[0.875rem] border border-gray-300 rounded-md transition-all bg-white placeholder-gray-300"
									/>
									<p className="text-[0.75rem] text-gray-400 mt-1">
										Must be unique within your company
									</p>
								</div>

								<div>
									<label
										htmlFor="description"
										className="block text-[0.8125rem] font-medium text-gray-700 mb-1.5"
									>
										Description
										<span className="text-[0.75rem] text-gray-400 font-light ml-1">
											optional
										</span>
									</label>
									<textarea
										id="description"
										name="description"
										rows={3}
										placeholder="Brief description of the brand..."
										className="w-full px-3 py-2 text-[0.875rem] border border-gray-300 rounded-md transition-all resize-none bg-white placeholder-gray-300"
									></textarea>
								</div>
							</div>
						</div>

						{/* Form actions  */}
						<div className="px-6 py-4 bg-gray-50 flex items-center justify-between gap-3">
							<a
								href="/brands"
								className="inline-flex items-center justify-center px-4 py-[0.4rem] text-[0.8125rem] font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-white hover:border-gray-400 transition-colors no-underline"
							>
								Cancel
							</a>
							<button
								type="submit"
								className="inline-flex items-center justify-center px-5 py-[0.4rem] text-[0.8125rem] font-medium text-white bg-green-mid border border-green-mid rounded-md hover:bg-green-deep hover:border-green-deep transition-colors cursor-pointer"
							>
								Create Brand
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default CreateBrand;
