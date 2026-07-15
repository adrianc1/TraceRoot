const removeUnderscore = (column: string) => column.replace(/_/g, ' ');

export const OneTableResponse = ({
	header,
	answer,
}: {
	header: string;
	answer: string;
}) => {
	return (
		<div className="w-full md:w-2/3 mb-6 rounded-lg border border-green-border bg-green-light px-4 py-6 text-center">
			<p className="font-mono text-4xl font-medium tracking-tightest text-green-deep">
				{answer}
			</p>
			<p className="mt-1 text-[0.8125rem] text-green-mid">
				{removeUnderscore(header)}
			</p>
		</div>
	);
};
