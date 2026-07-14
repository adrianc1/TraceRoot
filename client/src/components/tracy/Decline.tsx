export const Decline = ({ message }: { message: string }) => {
	return (
		<div className="w-full md:w-2/3 mb-6 flex gap-3 rounded-lg border border-amber-300 bg-amber-light px-4 py-3">
			<svg
				viewBox="0 0 20 20"
				fill="currentColor"
				aria-hidden="true"
				className="mt-0.5 h-4 w-4 shrink-0 text-amber-dark"
			>
				<path d="M10 1.5a8.5 8.5 0 100 17 8.5 8.5 0 000-17zM9 5.5h2v6H9v-6zm0 7.5h2v2H9v-2z" />
			</svg>
			<p className="text-[0.8125rem] leading-relaxed text-amber-dark">
				{message}
			</p>
		</div>
	);
};
