import { useState, useEffect } from 'react';
import type { CurrentUser, User } from '../../types/user';

const GetUsers = () => {
	const [users, setUsers] = useState<User[]>([]);
	const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

	const handleDeactivate = async (id: number) => {
		if (!confirm('Deactivate this user? They will no longer be able to log in.')) return;
		const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
		if (res.ok) {
			setUsers((prev) => prev.map((u) => u.id === id ? { ...u, active: false } : u));
		}
	};

	const handleReactivate = async (id: number) => {
		const res = await fetch(`/api/users/${id}/reactivate`, { method: 'PUT' });
		if (res.ok) {
			setUsers((prev) => prev.map((u) => u.id === id ? { ...u, active: true } : u));
		}
	};

	useEffect(() => {
		const fetchUsers = async () => {
			const res = await fetch('/api/users');
			const data = await res.json();
			setUsers(data.users);
			console.log(data.users);
		};
		fetchUsers();
	}, []);
	useEffect(() => {
		const fetchCurrentUser = async () => {
			const res = await fetch('/api/users/me');
			const data = await res.json();
			setCurrentUser(data);
		};
		fetchCurrentUser();
	}, []);

	const ROLE_STYLES = {
		admin: 'bg-green-light text-green-deep',
		manager: 'bg-blue-50 text-blue-700',
		staff: 'bg-orange-100 text-orange-500',
	};

	return (
		<div className="max-w-4xl mx-auto px-6 py-8 flex-1 w-full">
			<div className="mb-6">
				<div className="flex items-center justify-between gap-4 mb-6">
					<div>
						<h1 className="text-xl font-semibold tracking-tight text-gray-900">
							Users
						</h1>
						<p className="text-sm text-gray-400 font-light mt-0.5">
							Manage your team and permissions
						</p>
					</div>
					<a
						href="/users/invite"
						className="inline-flex items-center justify-center whitespace-nowrap shrink-0 px-4 py-[0.4rem] text-[0.8125rem] font-medium text-white bg-green-mid border border-green-mid rounded-md hover:bg-green-deep hover:border-green-deep transition-colors no-underline"
					>
						+ Invite User
					</a>
				</div>
				<div className="bg-white border border-gray-200 rounded-xl overflow-x-auto">
					<table className="w-full border-collapse">
						<thead>
							<tr className="border-b border-gray-200 bg-gray-50">
								<th className="text-left text-[0.7rem] font-medium text-gray-400 uppercase tracking-[0.06em] px-4 py-3">
									Name
								</th>
								<th className="text-left text-[0.7rem] font-medium text-gray-400 uppercase tracking-[0.06em] px-4 py-3">
									Email
								</th>
								<th className="text-left text-[0.7rem] font-medium text-gray-400 uppercase tracking-[0.06em] px-4 py-3">
									Role
								</th>
								<th className="text-left text-[0.7rem] font-medium text-gray-400 uppercase tracking-[0.06em] px-4 py-3">
									Joined
								</th>
								<th className="text-left text-[0.7rem] font-medium text-gray-400 uppercase tracking-[0.06em] px-4 py-3"></th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100">
							{users?.map((user) => (
								<tr
									key={user.id}
									className={`transition-colors ${user.active ? "hover:bg-gray-50" : "bg-gray-50 opacity-60"}`}
								>
									{/* <!-- Name --> */}
									<td className="px-4 py-3">
										<div className="flex items-center gap-2.5">
											<div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-[0.7rem] font-medium text-gray-500">
												{user.first_name[0]}
												{user.last_name[0]}
											</div>
											<div>
												<div className="text-[0.8125rem] font-medium text-gray-900">
													{user.first_name} {user.last_name}
													{user.id === currentUser?.id && (
														<span className="text-[0.7rem] text-gray-400 font-normal ml-1">
															(you)
														</span>
													)}
												</div>
											</div>
										</div>
									</td>

									{/* <!-- Email --> */}
									<td className="px-4 py-3">
										<span className="text-[0.8125rem] text-gray-500">
											{user.email}
										</span>
									</td>

									{/* <!-- Role badge --> */}
									<td className="px-4 py-3">
										<span
											className={`inline-flex items-center font-mono text-[0.7rem] font-medium px-2 py-[0.2rem] rounded capitalize ${ROLE_STYLES[user.role]}`}
										>
											{user.role}
										</span>
									</td>

									{/* <!-- Joined --> */}
									<td className="px-4 py-3">
										<span className="text-[0.8125rem] text-gray-400">
											{new Date(user.created_at).toLocaleDateString('en-US', {
												month: 'short',
												day: 'numeric',
												year: 'numeric',
											})}
										</span>
									</td>

									{/* <!-- Actions --> */}
									<td className="px-4 py-3">
										{user.id !== currentUser?.id && (
											<div className="flex items-center gap-3">
												{user.active ? (
													<>
														<a
															href={`/users/${user.id}/edit`}
															className="text-[0.75rem] text-gray-400 hover:text-gray-700 transition-colors font-medium no-underline"
														>
															Edit
														</a>
														{currentUser?.role === 'admin' && (
															<button
																onClick={() => handleDeactivate(user.id)}
																className="text-[0.75rem] text-red-400 hover:text-red-600 transition-colors font-medium cursor-pointer"
															>
																Deactivate
															</button>
														)}
													</>
												) : (
													currentUser?.role === 'admin' && (
														<button
															onClick={() => handleReactivate(user.id)}
															className="text-[0.75rem] text-green-600 hover:text-green-800 transition-colors font-medium cursor-pointer"
														>
															Reactivate
														</button>
													)
												)}
											</div>
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>

					{/* <!-- Empty state --> */}
					{!users ||
						(users.length === 0 && (
							<div className="py-16 text-center">
								<p className="text-sm font-medium text-gray-500">
									No users yet
								</p>
								<p className="text-xs text-gray-400 mt-1 mb-4">
									Invite your team to get started
								</p>
								<a
									href="/users/invite"
									className="inline-flex items-center justify-center px-4 py-[0.4rem] text-[0.8125rem] font-medium text-white bg-green-mid border border-green-mid rounded-md hover:bg-green-deep transition-colors no-underline"
								>
									Invite User
								</a>
							</div>
						))}

					{/* <!-- Footer --> */}
					{users && users.length > 0 && (
						<div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
							<span className="font-mono text-[0.72rem] text-gray-400">
								<span className="text-gray-600 font-medium">
									{users.length}
								</span>{' '}
								users
							</span>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default GetUsers;
