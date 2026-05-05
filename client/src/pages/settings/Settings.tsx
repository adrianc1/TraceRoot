import { useState, useEffect } from 'react';
import type { CurrentUser } from '../../types/user';

interface Billing {
	stripe_subscription_status: string | null;
	trial_ends_at: string | null;
}

const Settings = () => {
	const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
	const [billing, setBilling] = useState<Billing | null>(null);

	useEffect(() => {
		fetch('/api/users/me', { credentials: 'include' })
			.then((res) => res.json())
			.then(setCurrentUser);
	}, []);

	useEffect(() => {
		if (!currentUser || currentUser.role !== 'admin') return;
		fetch('/api/billing', { credentials: 'include' })
			.then((res) => res.json())
			.then(setBilling);
	}, [currentUser]);

	const status = billing?.stripe_subscription_status;
	const trialEnds = billing?.trial_ends_at;
	const isActive = status === 'active';
	const isTrial = !isActive && !!trialEnds && new Date(trialEnds) > new Date();

	return (
		<div className="max-w-2xl mx-auto px-6 py-8 flex-1 w-full">
			<div className="mb-6">
				<h1 className="text-xl font-semibold tracking-tight text-gray-900">
					Settings
				</h1>
				<p className="text-sm text-gray-500 font-light mt-0.5">
					Manage your preferences
				</p>
			</div>

			<div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
				{currentUser?.role === 'admin' && (
					<>
						<div className="px-6 py-5 border-b border-gray-100">
							<div className="text-[0.7rem] font-mono text-gray-700 uppercase tracking-[0.08em]">
								Team
							</div>
						</div>
						<div className="px-6 py-5 flex items-center justify-between gap-4 border-b border-gray-100">
							<div>
								<div className="text-[0.875rem] font-medium text-gray-900">
									Users
								</div>
								<div className="text-[0.8125rem] text-gray-500 mt-0.5">
									Invite, manage, and view user profiles
								</div>
							</div>
							<a
								href="/users"
								className="inline-flex items-center justify-center whitespace-nowrap shrink-0 px-4 py-[0.4rem] text-[0.8125rem] font-medium text-blue-600 border border-blue-200 rounded-md hover:bg-blue-50 hover:border-blue-300 transition-colors no-underline"
							>
								View users
							</a>
						</div>

						<div className="px-6 py-5 border-b border-gray-100">
							<div className="text-[0.7rem] font-mono text-gray-700 uppercase tracking-[0.08em]">
								Subscription
							</div>
						</div>
						<div className="px-6 py-5 flex items-center justify-between gap-4 border-b border-gray-100">
							<div>
								<div className="flex items-center gap-2">
									<div className="text-[0.875rem] font-medium text-gray-900">
										Plan status
									</div>
									{isActive ? (
										<span className="inline-flex items-center px-2 py-0.5 rounded-full text-[0.7rem] font-medium bg-green-light text-green-deep border border-green-border">
											Active
										</span>
									) : isTrial ? (
										<span className="inline-flex items-center px-2 py-0.5 rounded-full text-[0.7rem] font-medium bg-amber-50 text-amber-700 border border-amber-200">
											Trial
										</span>
									) : (
										<span className="inline-flex items-center px-2 py-0.5 rounded-full text-[0.7rem] font-medium bg-red-50 text-red-600 border border-red-200">
											Expired
										</span>
									)}
								</div>
								<div className="text-[0.8125rem] text-gray-500 mt-0.5">
									{isActive
										? 'Your subscription is active.'
										: isTrial && trialEnds
											? `Trial ends ${new Date(trialEnds).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}.`
											: 'Your trial has expired. Activate a plan to restore access.'}
								</div>
							</div>
							{!isActive && (
								<a
									href="/pricing"
									className="inline-flex items-center justify-center whitespace-nowrap shrink-0 px-4 py-[0.4rem] text-[0.8125rem] font-medium text-white bg-green-mid border border-green-mid rounded-md hover:bg-green-deep hover:border-green-deep transition-colors no-underline"
								>
									Upgrade
								</a>
							)}
						</div>
					</>
				)}

				<div className="px-6 py-5 border-b border-gray-100">
					<div className="text-[0.7rem] font-mono text-gray-700 uppercase tracking-[0.08em]">
						Session
					</div>
				</div>
				<div className="px-6 py-5 flex items-center justify-between gap-4">
					<div>
						<div className="text-[0.875rem] font-medium text-gray-900">
							Log out
						</div>
						<div className="text-[0.8125rem] text-gray-500 mt-0.5">
							Sign out of your account on this device
						</div>
					</div>
					<a
						href="/logout"
						className="inline-flex items-center justify-center whitespace-nowrap shrink-0 px-4 py-[0.4rem] text-[0.8125rem] font-medium text-red-600 border border-red-200 rounded-md hover:bg-red-50 hover:border-red-300 transition-colors no-underline"
					>
						Log out
					</a>
				</div>
			</div>
		</div>
	);
};

export default Settings;
