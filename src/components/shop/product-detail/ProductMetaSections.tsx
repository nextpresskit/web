import { PackageIcon, TruckIcon } from "lucide-react";

import { Badge } from "#/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableRow,
} from "#/components/ui/table";
import {
	formatSpecValue,
	humanizeSpecKey,
	type Product,
} from "#/lib/products";

function formatPublishedAt(iso: string): string {
	return new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	}).format(new Date(iso));
}

function dimensionEntries(product: Product): { label: string; value: string }[] {
	const dim = product.dimensionsMm;
	const unit = dim.unit ?? "";
	const out: { label: string; value: string }[] = [];

	for (const [rawKey, rawVal] of Object.entries(dim)) {
		if (rawKey === "unit" || rawVal === undefined || rawVal === null) {
			continue;
		}
		const label = humanizeSpecKey(rawKey);
		if (typeof rawVal === "number") {
			out.push({
				label,
				value: unit ? `${rawVal.toLocaleString("en-US")} ${unit}` : String(rawVal),
			});
		} else {
			out.push({ label, value: String(rawVal) });
		}
	}

	return out;
}

function specRows(product: Product): { key: string; value: string }[] {
	return Object.entries(product.specifications).map(([k, v]) => ({
		key: humanizeSpecKey(k),
		value: formatSpecValue(v),
	}));
}

type ProductMetaSectionsProps = {
	product: Product;
};

export function ProductMetaSections({ product }: ProductMetaSectionsProps) {
	const dims = dimensionEntries(product);
	const specs = specRows(product);

	return (
		<div className="space-y-10">
			<section className="space-y-3">
				<h2 className="text-lg font-semibold tracking-tight">About this item</h2>
				<p className="text-muted-foreground leading-relaxed">{product.description}</p>
			</section>

			{product.tags.length > 0 ? (
				<section className="space-y-3">
					<h2 className="text-lg font-semibold tracking-tight">Tags</h2>
					<div className="flex flex-wrap gap-2">
						{product.tags.map((tag) => (
							<Badge key={tag} variant="outline">
								{tag}
							</Badge>
						))}
					</div>
				</section>
			) : null}

			{product.materials.length > 0 ? (
				<section className="space-y-3">
					<h2 className="text-lg font-semibold tracking-tight">Materials</h2>
					<ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm leading-relaxed">
						{product.materials.map((m) => (
							<li key={m}>{m}</li>
						))}
					</ul>
				</section>
			) : null}

			{dims.length > 0 ? (
				<section className="space-y-3">
					<h2 className="text-lg font-semibold tracking-tight">Dimensions</h2>
					<dl className="grid gap-2 sm:grid-cols-2">
						{dims.map((row) => (
							<div
								key={row.label}
								className="flex justify-between gap-4 border-b py-2 text-sm last:border-b-0 sm:block sm:rounded-lg sm:border sm:p-3"
							>
								<dt className="text-muted-foreground font-medium">{row.label}</dt>
								<dd className="text-foreground text-right sm:mt-1 sm:text-left">
									{row.value}
								</dd>
							</div>
						))}
					</dl>
				</section>
			) : null}

			{specs.length > 0 ? (
				<section className="space-y-3">
					<h2 className="text-lg font-semibold tracking-tight">Specifications</h2>
					<Table>
						<TableBody>
							{specs.map((row) => (
								<TableRow key={row.key}>
									<TableCell className="text-muted-foreground w-[40%] whitespace-normal font-medium">
										{row.key}
									</TableCell>
									<TableCell className="whitespace-normal">{row.value}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</section>
			) : null}

			<section className="grid gap-6 md:grid-cols-2">
				<Card>
					<CardHeader className="pb-2">
						<div className="flex items-center gap-2">
							<TruckIcon className="text-muted-foreground size-4" aria-hidden />
							<CardTitle className="text-base">Shipping</CardTitle>
						</div>
						<CardDescription>
							How this item leaves our warehouse.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-2 text-sm">
						<p>
							<span className="text-muted-foreground">Handling: </span>
							<span className="font-medium tabular-nums">
								{product.shipping.handlingDays}{" "}
								{product.shipping.handlingDays === 1 ? "day" : "days"}
							</span>
						</p>
						<p>
							<span className="text-muted-foreground">Ships from: </span>
							<span className="font-medium">{product.shipping.shipsFrom}</span>
						</p>
						<p>
							{product.shipping.freeShippingEligible ? (
								<Badge variant="secondary">Free shipping eligible</Badge>
							) : (
								<span className="text-muted-foreground">Standard shipping rates apply</span>
							)}
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-2">
						<div className="flex items-center gap-2">
							<PackageIcon className="text-muted-foreground size-4" aria-hidden />
							<CardTitle className="text-base">Details &amp; policies</CardTitle>
						</div>
					</CardHeader>
					<CardContent className="space-y-2 text-sm">
						<p>
							<span className="text-muted-foreground">Weight: </span>
							<span className="font-medium tabular-nums">
								{product.weightGrams.toLocaleString("en-US")} g
							</span>
						</p>
						<p>
							<span className="text-muted-foreground">Country of origin: </span>
							<span className="font-medium">{product.countryOfOrigin}</span>
						</p>
						<p>
							<span className="text-muted-foreground">Warranty: </span>
							<span className="font-medium">
								{product.warrantyMonths > 0
									? `${product.warrantyMonths} months`
									: "None listed"}
							</span>
						</p>
						<p>
							<span className="text-muted-foreground">Returns: </span>
							<span className="font-medium tabular-nums">
								{product.returnPolicyDays} days
							</span>
						</p>
						<p>
							<span className="text-muted-foreground">Listed: </span>
							<span className="font-medium">{formatPublishedAt(product.publishedAt)}</span>
						</p>
					</CardContent>
				</Card>
			</section>

			{product.careInstructions ? (
				<section className="space-y-3">
					<h2 className="text-lg font-semibold tracking-tight">Care instructions</h2>
					<p className="text-muted-foreground text-sm leading-relaxed">
						{product.careInstructions}
					</p>
				</section>
			) : null}
		</div>
	);
}
