import { useEffect, useState } from 'react';
import type { User, Role } from '../../types/user';
import { useNavigate, useParams } from 'react-router-dom';
const EditUserForm = () => {
	const [user, setUser] = useState<User | null>(null);
	const [role, setRole] = useState<Role>('staff');

	const { id } = useParams();
	const navigate = useNavigate();

	useEffect(() => {
		const fetchUser = async () => {
			const res = await fetch(`/api/users/${id}/edit`);
			const data = await res.json();
			setUser(data);
			setRole(data.role);
		};
		fetchUser();
	}, [id]);

	const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);

		const response = await fetch(`/api/users/${id}/edit`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				role: formData.get('role'),
			}),
		});

		if (response.ok) {
			navigate('/users');
		} else {
			console.error('Failed to update user');
		}
	};
	return (
		<div className="max-w-md mx-auto px-6 py-8 flex-1 w-full">
			<a
				href="/users"
				className="inline-flex items-center gap-1.5 text-[0.8125rem] text-gray-400 hover:text-gray-700 transition-colors no-underline mb-6"
			>
				← Back to users
			</a>
			<div className="mb-6">
				<h1 className="text-xl font-semibold tracking-tight text-gray-900">
					Edit User
				</h1>
				<p className="text-sm text-gray-400 font-light mt-0.5">
					Update role and permissions for this team member
				</p>
			</div>
			<div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
				<form onSubmit={handleSubmit}>
					<div className="px-6 py-5 border-b border-gray-100">
						<div className="text-[0.7rem] font-mono text-gray-400 uppercase tracking-[0.08em] mb-4">
							User Details
						</div>

						{/* Name & email — read only */}
						<div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-5">
							<div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-[0.7rem] font-medium text-gray-500 shrink-0">
								{user?.first_name[0]}
								{user?.last_name[0]}
							</div>
							<div>
								<p className="text-[0.8125rem] font-medium text-gray-900">
									{user?.first_name} {user?.last_name}
								</p>
								<p className="text-[0.75rem] text-gray-400 font-mono">
									{user?.email}
								</p>
							</div>
						</div>

						{/* Role */}
						<div>
							<label
								htmlFor="role"
								className="block text-[0.8125rem] font-medium text-gray-700 mb-1.5"
							>
								Role <span className="text-red-400">*</span>
							</label>
							<select
								name="role"
								id="role"
								value={role}
								onChange={(e) => setRole(e.target.value as Role)}
								required
								className="w-full px-3 py-2 text-[0.875rem] border border-gray-300 rounded-md bg-white text-gray-700"
							>
								<option value="admin">Admin</option>
								<option value="manager">Manager</option>
								<option value="staff">Staff</option>
							</select>
							<div className="mt-2 space-y-1">
								<p className="text-[0.75rem] text-gray-400">
									<span className="font-medium text-gray-500">Admin</span> —
									full access including user management
								</p>
								<p className="text-[0.75rem] text-gray-400">
									<span className="font-medium text-gray-500">Manager</span> —
									full inventory access, no user management
								</p>
								<p className="text-[0.75rem] text-gray-400">
									<span className="font-medium text-gray-500">Staff</span> —
									view and quantity updates only
								</p>
							</div>
						</div>
					</div>

					<div className="px-6 py-4 bg-gray-50 flex items-center justify-between gap-3">
						<a
							href="/users"
							className="inline-flex items-center justify-center px-4 py-[0.4rem] text-[0.8125rem] font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-white hover:border-gray-400 transition-colors no-underline"
						>
							Cancel
						</a>
						<button
							type="submit"
							className="inline-flex items-center justify-center px-5 py-[0.4rem] text-[0.8125rem] font-medium text-white bg-green-mid border border-green-mid rounded-md hover:bg-green-deep hover:border-green-deep transition-colors cursor-pointer"
						>
							Save Changes
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default EditUserForm;
