import { createFileRoute } from "@tanstack/react-router";
import { Activity, Eye, Package, TrendingUp } from "lucide-react";
import { useMemo } from "react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Line,
	LineChart,
	XAxis,
	YAxis,
} from "recharts";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "#/components/ui/chart";
import adminProductSales from "#/dummy_data/admin_product_sales.json";
import adminVisits from "#/dummy_data/admin_visits.json";
import { ContentOverview } from "#/features/admin/dashboard/ContentOverview";
import { formatProductPrice } from "#/helpers/products";

export const Route = createFileRoute("/admin/_layout/dashboard")({
	component: RouteComponent,
});

const visitsChartConfig = {
	visits: {
		label: "Page views",
		color: "var(--chart-1)",
	},
	uniqueVisitors: {
		label: "Unique visitors",
		color: "var(--chart-2)",
	},
} satisfies ChartConfig;

const salesChartConfig = {
	revenue: {
		label: "Revenue",
		color: "var(--chart-3)",
	},
} satisfies ChartConfig;

function StatCard({
	title,
	value,
	hint,
	icon: Icon,
}: {
	title: string;
	value: string;
	hint: string;
	icon: typeof Eye;
}) {
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between pb-2">
				<CardTitle className="font-medium text-sm">{title}</CardTitle>
				<Icon className="text-muted-foreground size-4" aria-hidden />
			</CardHeader>
			<CardContent className="space-y-1">
				<div className="text-2xl font-semibold tabular-nums">{value}</div>
				<p className="text-muted-foreground text-xs">{hint}</p>
			</CardContent>
		</Card>
	);
}

function RouteComponent() {
	const visitSeries = useMemo(
		() =>
			adminVisits.daily.map((row) => ({
				...row,
				label: new Date(`${row.date}T12:00:00`).toLocaleDateString("en-US", {
					month: "short",
					day: "numeric",
				}),
			})),
		[],
	);

	const totalVisits = useMemo(
		() => adminVisits.daily.reduce((sum, d) => sum + d.visits, 0),
		[],
	);

	const avgDailyUniques = useMemo(() => {
		const sum = adminVisits.daily.reduce((s, d) => s + d.uniqueVisitors, 0);
		return Math.round(sum / adminVisits.daily.length);
	}, []);

	const totalRevenue = useMemo(
		() => adminProductSales.items.reduce((s, i) => s + i.revenue, 0),
		[],
	);

	const totalUnits = useMemo(
		() => adminProductSales.items.reduce((s, i) => s + i.unitsSold, 0),
		[],
	);

	return (
		<div className="w-full space-y-8 px-4 py-8 md:px-8">
			<header className="space-y-1">
				<h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
				<p className="text-muted-foreground text-sm">
					Live content from the NextPressKit backend, plus demo traffic and
					sales charts.
				</p>
			</header>

			<ContentOverview />

			<section aria-labelledby="overview-heading" className="space-y-4">
				<div className="flex items-center gap-2">
					<h2 id="overview-heading" className="font-semibold text-lg">
						Traffic and sales
					</h2>
					<span className="rounded-md border px-2 py-0.5 text-muted-foreground text-xs">
						Demo data
					</span>
				</div>
				<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
					<StatCard
						title="Page views"
						value={totalVisits.toLocaleString()}
						hint={adminVisits.rangeLabel}
						icon={Eye}
					/>
					<StatCard
						title="Avg. daily visitors"
						value={avgDailyUniques.toLocaleString()}
						hint="Mean unique visitors per day"
						icon={Activity}
					/>
					<StatCard
						title="Revenue"
						value={formatProductPrice(totalRevenue, adminProductSales.currency)}
						hint={adminProductSales.periodLabel}
						icon={TrendingUp}
					/>
					<StatCard
						title="Units sold"
						value={totalUnits.toLocaleString()}
						hint="Across tracked SKUs"
						icon={Package}
					/>
				</div>
			</section>

			<section
				className="grid gap-6 lg:grid-cols-2"
				aria-labelledby="charts-heading"
			>
				<h2 id="charts-heading" className="sr-only">
					Charts
				</h2>

				<Card className="gap-4">
					<CardHeader>
						<CardTitle>Visits</CardTitle>
						<CardDescription>
							Page views and unique visitors,{" "}
							{adminVisits.rangeLabel.toLowerCase()}.
						</CardDescription>
					</CardHeader>
					<CardContent className="pt-0">
						<ChartContainer
							config={visitsChartConfig}
							className="aspect-auto h-[280px] w-full md:h-[320px]"
						>
							<LineChart
								data={visitSeries}
								margin={{ left: 8, right: 8, top: 8, bottom: 8 }}
							>
								<CartesianGrid vertical={false} strokeDasharray="4 4" />
								<XAxis
									dataKey="label"
									tickLine={false}
									axisLine={false}
									tickMargin={8}
									interval="preserveStartEnd"
									minTickGap={24}
								/>
								<YAxis
									tickLine={false}
									axisLine={false}
									tickMargin={8}
									width={44}
								/>
								<ChartTooltip content={<ChartTooltipContent />} />
								<ChartLegend content={<ChartLegendContent />} />
								<Line
									type="monotone"
									dataKey="visits"
									stroke="var(--color-visits)"
									strokeWidth={2}
									dot={false}
								/>
								<Line
									type="monotone"
									dataKey="uniqueVisitors"
									stroke="var(--color-uniqueVisitors)"
									strokeWidth={2}
									dot={false}
								/>
							</LineChart>
						</ChartContainer>
					</CardContent>
				</Card>

				<Card className="gap-4">
					<CardHeader>
						<CardTitle>Product sales</CardTitle>
						<CardDescription>
							Revenue by product, {adminProductSales.periodLabel.toLowerCase()}.
						</CardDescription>
					</CardHeader>
					<CardContent className="pt-0">
						<ChartContainer
							config={salesChartConfig}
							className="aspect-auto h-[320px] w-full"
						>
							<BarChart
								layout="vertical"
								data={adminProductSales.items}
								margin={{ left: 0, right: 16, top: 8, bottom: 8 }}
							>
								<CartesianGrid horizontal={false} strokeDasharray="4 4" />
								<XAxis
									type="number"
									tickLine={false}
									axisLine={false}
									tickFormatter={(v) =>
										formatProductPrice(Number(v), adminProductSales.currency)
									}
								/>
								<YAxis
									dataKey="productName"
									type="category"
									width={132}
									tickLine={false}
									axisLine={false}
									tick={{ fontSize: 11 }}
								/>
								<ChartTooltip
									content={
										<ChartTooltipContent
											formatter={(value) =>
												formatProductPrice(
													Number(value),
													adminProductSales.currency,
												)
											}
										/>
									}
								/>
								<Bar
									dataKey="revenue"
									fill="var(--color-revenue)"
									radius={[0, 4, 4, 0]}
								/>
							</BarChart>
						</ChartContainer>
					</CardContent>
				</Card>
			</section>
		</div>
	);
}
