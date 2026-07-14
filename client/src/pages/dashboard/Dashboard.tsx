import { useEffect, useState } from 'react';
import type { DashboardStats } from '../../types/dashboard';
import StatTile from '../../components/charts/StatTile';
import ChartCard, { ChartTable } from '../../components/charts/ChartCard';
import DonutChart from '../../components/charts/DonutChart';
import HBarChart from '../../components/charts/HBarChart';
import LineChart from '../../components/charts/LineChart';
import { TracyAI } from '../../components/tracy/TracyAI.tsx';
import {
	SERIES_COLORS,
	formatMoney,
	formatCount,
} from '../../components/charts/chartTheme';

function formatDay(iso: string): string {
	const d = new Date(iso + 'T00:00:00');
	return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const Dashboard = () => {
	const [stats, setStats] = useState<DashboardStats | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchStats = async () => {
			try {
				const res = await fetch('/api/dashboard', { credentials: 'include' });
				if (!res.ok) throw new Error(`Request failed (${res.status})`);
				setStats(await res.json());
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Failed to load');
			}
		};
		fetchStats();
	}, []);

	if (error) {
		return (
			<div className="max-w-7xl mx-auto px-6 py-10">
				<p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-4">
					Could not load dashboard: {error}
				</p>
			</div>
		);
	}

	if (!stats) {
		return (
			<div className="max-w-7xl mx-auto px-6 py-10">
				<p className="text-sm text-gray-500">Loading dashboard…</p>
			</div>
		);
	}

	const { kpis, byCategory, byLocation, dailyMovements, statusBreakdown } =
		stats;

	return (
		<div className="bg-gray-50 min-h-screen">
			<div className="max-w-7xl mx-auto px-6 py-8">
				<h1 className="text-xl font-semibold text-gray-900 mb-6">Dashboard</h1>
				<TracyAI />
				{/* KPI row */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
					<StatTile
						label="Inventory value"
						value={formatMoney(kpis.inventory_value)}
						hint="active packages"
					/>
					<StatTile
						label="Active packages"
						value={formatCount(kpis.active_packages)}
						hint={`${formatCount(kpis.low_stock_packages)} at zero quantity`}
					/>
					<StatTile
						label="Active products"
						value={formatCount(kpis.active_products)}
						hint={`across ${formatCount(kpis.active_locations)} locations`}
					/>
					<StatTile
						label="Movements (30d)"
						value={formatCount(kpis.movements_30d)}
						hint="receives, adjustments, splits"
					/>
				</div>

				{/* charts */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
					<ChartCard
						title="Inventory value by category"
						subtitle="Active packages, quantity × cost"
						chart={
							<DonutChart
								data={byCategory.map((c) => ({
									label: c.category,
									value: c.value,
								}))}
								formatValue={formatMoney}
							/>
						}
						table={
							<ChartTable
								headers={['Category', 'Value', 'Packages']}
								rows={byCategory.map((c) => [
									c.category,
									formatMoney(c.value),
									c.package_count,
								])}
							/>
						}
					/>
					<ChartCard
						title="Inventory value by location"
						subtitle="Active packages per location"
						chart={
							<HBarChart
								data={byLocation.map((l) => ({
									label: l.location,
									value: l.value,
								}))}
								color={SERIES_COLORS[0]}
								formatValue={formatMoney}
							/>
						}
						table={
							<ChartTable
								headers={['Location', 'Value', 'Packages']}
								rows={byLocation.map((l) => [
									l.location,
									formatMoney(l.value),
									l.package_count,
								])}
							/>
						}
					/>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
					<ChartCard
						className="lg:col-span-2"
						title="Inventory activity"
						subtitle="Movements per day, last 30 days"
						chart={
							<LineChart
								data={dailyMovements.map((d) => ({
									label: d.day,
									value: d.movements,
								}))}
								color={SERIES_COLORS[0]}
								formatValue={formatCount}
								formatLabel={formatDay}
							/>
						}
						table={
							<ChartTable
								headers={['Day', 'Movements']}
								rows={dailyMovements.map((d) => [
									formatDay(d.day),
									d.movements,
								])}
							/>
						}
					/>
					<ChartCard
						title="Packages by status"
						subtitle="All packages"
						chart={
							<HBarChart
								data={statusBreakdown.map((s) => ({
									label: s.status,
									value: s.count,
								}))}
								color={SERIES_COLORS[1]}
								formatValue={formatCount}
							/>
						}
						table={
							<ChartTable
								headers={['Status', 'Packages']}
								rows={statusBreakdown.map((s) => [s.status, s.count])}
							/>
						}
					/>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
