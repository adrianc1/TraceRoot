import { useState, useEffect } from 'react';
import type { User } from '../../types/user';

const Account = () => {
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		const fetchCurrentUser = async () => {
			const res = await fetch('/api/users/me');
			const data = await res.json();
			setUser(data);
		};
		fetchCurrentUser();
	}, []);

	if (!user) return;
	return (
		<div className="max-w-2xl mx-auto px-6 py-8 flex-1 w-full">
			<div className="mb-6">
				<h1 className="text-xl font-semibold tracking-tight text-gray-900">
					Account
				</h1>
				<p className="text-sm text-gray-400 font-light mt-0.5">
					Your personal information
				</p>
			</div>

			{/* <!-- Profile card --> */}
			<div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
				{/* <!-- Avatar + name --> */}
				<div className="px-6 py-6 border-b border-gray-100 flex items-center gap-4">
					<div className="w-12 h-12 rounded-full bg-green-light flex items-center justify-center shrink-0">
						<span className="text-[1rem] font-semibold text-green-deep font-mono flex">
							{user.first_name[0]}
							{user.last_name[0]}
						</span>
					</div>
					<div>
						<div className="text-[0.9375rem] font-semibold text-gray-900">
							{user.first_name} {user.last_name}
						</div>
						<div className="text-[0.8125rem] text-gray-400 mt-0.5 font-mono">
							{user.email}
						</div>
					</div>
				</div>

				{/* <!-- Fields --> */}
				<div className="divide-y divide-gray-100">
					<div className="px-6 py-4 flex items-center justify-between">
						<span className="text-[0.7rem] font-mono text-gray-400 uppercase tracking-[0.08em]">
							First Name
						</span>
						<span className="text-[0.875rem] text-gray-900">
							{user.first_name}
						</span>
					</div>

					<div className="px-6 py-4 flex items-center justify-between">
						<span className="text-[0.7rem] font-mono text-gray-400 uppercase tracking-[0.08em]">
							Last Name
						</span>
						<span className="text-[0.875rem] text-gray-900">
							{user.last_name}
						</span>
					</div>

					<div className="px-6 py-4 flex items-center justify-between">
						<span className="text-[0.7rem] font-mono text-gray-400 uppercase tracking-[0.08em]">
							Email
						</span>
						<span className="text-[0.875rem] text-gray-900 font-mono">
							{user.email}
						</span>
					</div>

					<div className="px-6 py-4 flex items-center justify-between">
						<span className="text-[0.7rem] font-mono text-gray-400 uppercase tracking-[0.08em]">
							Role
						</span>
						<span
							className={`inline-flex items-center px-2 py-0.5 rounded text-[0.75rem] font-medium capitalize ${{ admin: 'bg-green-light text-green-deep', manager: 'bg-blue-50 text-blue-700', staff: 'bg-orange-100 text-orange-500' }[user.role]}`}
						>
							{user.role}
						</span>
					</div>

					<div className="px-6 py-4 flex items-center justify-between">
						<span className="text-[0.7rem] font-mono text-gray-400 uppercase tracking-[0.08em]">
							Company
						</span>
						<span className="text-[0.875rem] text-gray-900">
							{user.company_name}
						</span>
					</div>

					<div className="px-6 py-4 flex items-center justify-between">
						<span className="text-[0.7rem] font-mono text-gray-400 uppercase tracking-[0.08em]">
							Member Since
						</span>
						<span className="text-[0.875rem] text-gray-500">
							{new Date(user.created_at).toLocaleDateString('en-US', {
								month: 'long',
								day: 'numeric',
								year: 'numeric',
							})}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Account;
