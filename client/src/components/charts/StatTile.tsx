interface StatTileProps {
	label: string;
	value: string;
	hint?: string;
}

const StatTile = ({ label, value, hint }: StatTileProps) => (
	<div className="bg-white border border-gray-200 rounded-lg p-5">
		<p className="text-xs text-gray-500">{label}</p>
		<p className="text-3xl font-semibold text-gray-900 mt-1">{value}</p>
		{hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
	</div>
);

export default StatTile;
