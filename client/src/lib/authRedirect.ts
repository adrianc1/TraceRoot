// Global auth guard for the SPA.
//
// Protected API routes respond with 401 when the user isn't authenticated
// (see middleware/authMiddleware.ts). Because every page fetches its data
// from those routes, we intercept fetch once here: any 401 sends the user
// to the server-rendered login page. This means visiting a protected page
// while logged out reroutes to /login instead of rendering a broken shell.
export function installAuthRedirect(): void {
	const originalFetch = window.fetch.bind(window);

	window.fetch = async (input, init) => {
		const response = await originalFetch(input, init);

		if (
			response.status === 401 &&
			!window.location.pathname.startsWith('/login')
		) {
			window.location.href = '/login';
		}

		return response;
	};
}
