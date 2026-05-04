import { useEffect, useState, useRef } from 'react';
import type { CurrentUser } from '../types/user';

const Header = () => {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [isUserDropdownOpen, setIsUserDropdownOpen] = useState<boolean>(false);
	const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

	const ref = useRef<HTMLDivElement>(null);

	const toggleCatalogDropdown = () => {
		const catalogBtn = document.getElementById('catalog-menu-btn');
		if (!catalogBtn) return;
		setIsOpen(!isOpen);
	};

	const toggleUserDropdown = () => {
		const userBtn = document.getElementById('user-menu-btn');
		if (!userBtn) return;
		setIsUserDropdownOpen(!isUserDropdownOpen);
	};

	useEffect(() => {
		const fetchCurrentUser = async () => {
			try {
				const response = await fetch('/api/users/me', {
					credentials: 'include',
				});
				const user = await response.json();
				setCurrentUser(user);
			} catch (error) {
				console.error('Error fetching current user:', error);
			}
		};
		fetchCurrentUser();
	}, []);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const catalogMenu = document.getElementById('catalog-dropdown');

			if (catalogMenu && !catalogMenu.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
	}, []);

	return (
		<div className="">
			<header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
				<div className="max-w-7xl mx-auto px-6 h-[60px] flex items-center justify-between">
					{/* <!-- Logo --> */}
					<a
						href="/packages"
						className="flex items-center gap-2 no-underline shrink-0"
					>
						<img src="/tracerootheader.png" alt="TraceRoot" className="h-7" />
					</a>
					{/* <!-- Desktop nav links --> */}
					<nav className="hidden md:flex items-center gap-7">
						<a
							href="/packages"
							className="text-[0.8125rem] text-gray-600 hover:text-gray-900 transition-colors no-underline"
						>
							Packages
						</a>
						{/* <!-- Catalog dropdown --> */}
						<div className="relative" id="catalog-menu">
							<button
								id="catalog-menu-btn"
								className="flex items-center gap-1 text-[0.8125rem] text-gray-600 hover:text-gray-900 transition-colors cursor-pointer border-none bg-transparent p-0"
								onClick={toggleCatalogDropdown}
							>
								Catalog
								<svg
									id="catalog-chevron"
									className="w-3.5 h-3.5 text-gray-500 transition-transform duration-150"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M19 9l-7 7-7-7"
									/>
								</svg>
							</button>
							<div
								id="catalog-dropdown"
								ref={ref}
								className={`absolute left-0 top-[calc(100%+10px)] w-44 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50 ${isOpen ? 'block' : 'hidden'}`}
							>
								<div className="py-1">
									<a
										href="/packages/products"
										className="flex items-center px-4 py-2.5 text-[0.8125rem] text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors no-underline"
									>
										Products
									</a>
									<a
										href="/strains"
										className="flex items-center px-4 py-2.5 text-[0.8125rem] text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors no-underline"
									>
										Strains
									</a>
									<a
										href="/categories"
										className="flex items-center px-4 py-2.5 text-[0.8125rem] text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors no-underline"
									>
										Categories
									</a>
									<a
										href="/brands"
										className="flex items-center px-4 py-2.5 text-[0.8125rem] text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors no-underline"
									>
										Brands
									</a>
								</div>
							</div>
						</div>
						<a
							href="/transfers"
							className="text-[0.8125rem] text-gray-600 hover:text-gray-900 transition-colors no-underline"
						>
							Transfers
						</a>
						<a
							href="/locations"
							className="text-[0.8125rem] text-gray-600 hover:text-gray-900 transition-colors no-underline"
						>
							Locations
						</a>
					</nav>
					{/* <!-- Right side --> */}
					<div className="flex items-center gap-2">
						{/* <!-- Hamburger (mobile only) --> */}
						<button
							id="drawer-btn"
							className="md:hidden flex items-center justify-center w-9 h-9 rounded-md hover:bg-gray-100 transition-colors border-none bg-transparent cursor-pointer"
							aria-label="Open menu"
						>
							<svg
								className="w-5 h-5 text-gray-600"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M4 6h16M4 12h16M4 18h16"
								/>
							</svg>
						</button>
						{/* <!-- User dropdown (desktop) --> */}
						<div className="relative hidden md:block" id="user-menu">
							<button
								onClick={() => toggleUserDropdown()}
								id="user-menu-btn"
								className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-gray-100 transition-colors cursor-pointer border-none bg-transparent"
							>
								{/* <!-- Avatar initials --> */}
								<div className="w-7 h-7 rounded-full bg-green-light flex items-center justify-center shrink-0">
									<span className="text-[0.7rem] font-semibold text-green-deep font-mono">
										{currentUser?.first_name?.[0]}
									</span>
								</div>
								<span className="text-[0.8125rem] text-gray-700 font-medium">
									{currentUser?.first_name} {currentUser?.last_name}
								</span>
								{/* <!-- Chevron --> */}
								<svg
									id="chevron"
									className="w-3.5 h-3.5 text-gray-500 transition-transform duration-150"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M19 9l-7 7-7-7"
									/>
								</svg>
							</button>
							{/* <!-- Dropdown --> */}
							{isUserDropdownOpen && (
								<div
									id="user-dropdown"
									className="absolute right-0 top-[calc(100%+6px)] w-52 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50"
								>
									{/* <!-- User info header --> */}
									<div className="px-4 py-3 border-b border-gray-100">
										<div className="text-[0.8125rem] font-medium text-gray-900">
											{currentUser?.first_name} {currentUser?.last_name}
										</div>
										<div className="text-[0.75rem] text-gray-500 font-mono mt-0.5">
											{currentUser?.email}
										</div>
										{/* <!-- Company name --> */}
										<div className="text-[0.7rem] text-gray-500 mt-1 truncate">
											{currentUser?.company_name}
										</div>
									</div>
									{/* <!-- Menu items --> */}
									<div className="py-1">
										<a
											href="/users/account"
											className="flex items-center gap-3 px-4 py-2.5 text-[0.8125rem] text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors no-underline"
										>
											<svg
												className="w-4 h-4 text-gray-500 shrink-0"
												fill="none"
												stroke="currentColor"
												strokeWidth="1.75"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
												/>
											</svg>
											Account
										</a>
										<a
											href="/users/settings"
											className="flex items-center gap-3 px-4 py-2.5 text-[0.8125rem] text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors no-underline"
										>
											<svg
												className="w-4 h-4 text-gray-500 shrink-0"
												fill="none"
												stroke="currentColor"
												strokeWidth="1.75"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
												/>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
												/>
											</svg>
											Settings
										</a>
									</div>
									{/* <!-- Logout --> */}
									<div className="py-1 border-t border-gray-100">
										<a
											href="/logout"
											className="flex items-center gap-3 px-4 py-2.5 text-[0.8125rem] text-red-600 hover:bg-red-50 transition-colors no-underline"
										>
											<svg
												className="w-4 h-4 text-red-400 shrink-0"
												fill="none"
												stroke="currentColor"
												strokeWidth="1.75"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
												/>
											</svg>
											Log out
										</a>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</header>

			{/* <!-- Mobile drawer backdrop --> */}
			<div
				id="drawer-backdrop"
				className="fixed inset-0 bg-black/40 z-40 hidden md:hidden transition-opacity duration-200 opacity-0"
			></div>

			{/* <!-- Mobile drawer --> */}
			<div
				id="drawer"
				className="fixed top-0 left-0 h-full w-72 bg-white z-50 shadow-2xl flex flex-col md:hidden transition-transform duration-250 -translate-x-full"
			>
				{/* <!-- Drawer header --> */}
				<div className="flex items-center justify-between px-5 h-[60px] border-b border-gray-100 shrink-0">
					<img src="/tracerootheader.png" alt="TraceRoot" className="h-7" />
					<button
						id="drawer-close-btn"
						className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 transition-colors border-none bg-transparent cursor-pointer"
						aria-label="Close menu"
					>
						<svg
							className="w-4 h-4 text-gray-500"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</div>

				{/* <!-- Drawer nav --> */}
				<nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
					<a
						href="/packages"
						className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[0.875rem] text-gray-700 hover:bg-gray-100 transition-colors no-underline font-medium"
					>
						<svg
							className="w-4 h-4 text-gray-500 shrink-0"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.75"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"
							/>
						</svg>
						Packages
					</a>
					{/* <!-- Catalog section --> */}
					<div>
						<button
							id="drawer-catalog-btn"
							className="w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-[0.875rem] text-gray-700 hover:bg-gray-100 transition-colors border-none bg-transparent cursor-pointer font-medium"
						>
							<span className="flex items-center gap-3">
								<svg
									className="w-4 h-4 text-gray-500 shrink-0"
									fill="none"
									stroke="currentColor"
									strokeWidth="1.75"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
									/>
								</svg>
								Catalog
							</span>
							<svg
								id="drawer-catalog-chevron"
								className="w-3.5 h-3.5 text-gray-500 transition-transform duration-150"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M19 9l-7 7-7-7"
								/>
							</svg>
						</button>
						<div
							id="drawer-catalog-items"
							className="hidden pl-10 mt-0.5 space-y-0.5"
						>
							<a
								href="/packages/products"
								className="flex items-center px-3 py-2 rounded-lg text-[0.875rem] text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors no-underline"
							>
								Products
							</a>
							<a
								href="/categories"
								className="flex items-center px-3 py-2 rounded-lg text-[0.875rem] text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors no-underline"
							>
								Categories
							</a>
							<a
								href="/brands"
								className="flex items-center px-3 py-2 rounded-lg text-[0.875rem] text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors no-underline"
							>
								Brands
							</a>
							<a
								href="/strains"
								className="flex items-center px-3 py-2 rounded-lg text-[0.875rem] text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors no-underline"
							>
								Strains
							</a>
						</div>
					</div>
					<a
						href="/transfers"
						className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[0.875rem] text-gray-700 hover:bg-gray-100 transition-colors no-underline font-medium"
					>
						<svg
							className="w-4 h-4 text-gray-500 shrink-0"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.75"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
							/>
						</svg>
						Transfers
					</a>
					<a
						href="/locations"
						className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[0.875rem] text-gray-700 hover:bg-gray-100 transition-colors no-underline font-medium"
					>
						<svg
							className="w-4 h-4 text-gray-500 shrink-0"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.75"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
							/>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
							/>
						</svg>
						Locations
					</a>
				</nav>

				{/* <!-- mobile drawer footer: user info + logout --> */}
				<div className="border-t border-gray-100 px-3 py-4 shrink-0 space-y-0.5">
					<div className="flex items-center gap-3 px-3 py-2.5">
						<div className="w-7 h-7 rounded-full bg-green-light flex items-center justify-center shrink-0">
							<span className="text-[0.7rem] font-semibold text-green-deep font-mono">
								{currentUser?.first_name?.[0]}
								{currentUser?.last_name?.[0]}
							</span>
						</div>
						<div>
							<div className="text-[0.8125rem] font-medium text-gray-900">
								{currentUser?.first_name} {currentUser?.last_name}
							</div>
							<div className="text-[0.7rem] text-gray-500 font-mono">Email</div>
						</div>
					</div>
					<a
						href="/users/account"
						className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[0.875rem] text-gray-600 hover:bg-gray-100 transition-colors no-underline"
					>
						Account
					</a>
					<a
						href="/users/settings"
						className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[0.875rem] text-gray-600 hover:bg-gray-100 transition-colors no-underline"
					>
						Settings
					</a>
					<a
						href="/logout"
						className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[0.875rem] text-red-600 hover:bg-red-50 transition-colors no-underline"
					>
						Log out
					</a>
				</div>
			</div>
		</div>
	);
};

export default Header;
