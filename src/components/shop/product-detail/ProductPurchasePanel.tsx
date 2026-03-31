import { StarIcon } from "lucide-react";

import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { Separator } from "#/components/ui/separator";
import {
	formatProductPrice,
	humanizeSpecKey,
	type Product,
} from "#/lib/products";
import { cn } from "#/lib/utils";

function RatingDisplay({ rating, reviewCount }: { rating: number; reviewCount: number }) {
	const filledCount = Math.min(5, Math.max(0, Math.round(rating)));

	return (
		<div className="flex flex-wrap items-center gap-2">
			<span className="sr-only">
				{rating} out of 5 stars, {reviewCount} reviews
			</span>
			<div
				className="flex items-center gap-0.5 text-amber-500 dark:text-amber-400"
				aria-hidden
			>
				{[0, 1, 2, 3, 4].map((i) => {
					const filled = i < filledCount;
					return (
						<StarIcon
							key={i}
							className={cn("size-4 shrink-0", filled ? "fill-current" : "fill-none")}
						/>
					);
				})}
			</div>
			<span className="text-sm font-medium tabular-nums">{rating.toFixed(1)}</span>
			<span className="text-muted-foreground text-sm">
				({reviewCount.toLocaleString("en-US")}{" "}
				{reviewCount === 1 ? "review" : "reviews"})
			</span>
		</div>
	);
}

function StockLine({ product }: { product: Product }) {
	if (!product.inStock) {
		return (
			<p className="text-destructive text-sm font-medium">Out of stock</p>
		);
	}
	const low =
		product.stockQuantity <= product.lowStockThreshold &&
		product.stockQuantity > 0;
	return (
		<div className="space-y-1 text-sm">
			<p className="text-emerald-600 font-medium dark:text-emerald-400">In stock</p>
			<p className="text-muted-foreground tabular-nums">
				{product.stockQuantity} available
				{low ? (
					<span className="text-amber-600 dark:text-amber-400">
						{" "}
						· Low stock
					</span>
				) : null}
			</p>
		</div>
	);
}

type ProductPurchasePanelProps = {
	product: Product;
};

export function ProductPurchasePanel({ product }: ProductPurchasePanelProps) {
	const compareAt = product.compareAtPrice;
	const hasCompare =
		compareAt != null && compareAt > product.price;
	const savings =
		hasCompare && compareAt != null ? compareAt - product.price : 0;

	return (
		<div className="space-y-6">
			<div className="flex flex-wrap items-center gap-2">
				{product.featured ? (
					<Badge className="bg-amber-500 text-white hover:bg-amber-500/90 dark:bg-amber-600">
						Featured
					</Badge>
				) : null}
				{product.isNew ? <Badge variant="default">New</Badge> : null}
				{product.isBestseller ? (
					<Badge variant="secondary">Bestseller</Badge>
				) : null}
				<Badge variant="outline">{product.category}</Badge>
				<Badge variant="outline">{product.subcategory}</Badge>
			</div>

			<div className="space-y-2">
				<h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
					{product.name}
				</h1>
				<p className="text-muted-foreground text-sm">{product.shortDescription}</p>
				<p className="text-muted-foreground text-sm">
					Brand: <span className="text-foreground">{product.brand}</span>
				</p>
			</div>

			<RatingDisplay rating={product.rating} reviewCount={product.reviewCount} />

			<div className="flex flex-wrap items-baseline gap-3">
				<span className="text-3xl font-semibold tabular-nums">
					{formatProductPrice(product.price, product.currency)}
				</span>
				{hasCompare && compareAt != null ? (
					<>
						<span className="text-muted-foreground text-xl line-through tabular-nums">
							{formatProductPrice(compareAt, product.currency)}
						</span>
						<Badge variant="destructive" className="tabular-nums">
							Save {formatProductPrice(savings, product.currency)}
						</Badge>
					</>
				) : null}
			</div>

			<Separator />

			<StockLine product={product} />

			{(product.colors?.length || product.sizeOptions?.length) ? (
				<div className="space-y-3 text-sm">
					{product.colors?.length ? (
						<div>
							<p className="text-muted-foreground mb-2 font-medium">
								Colors
							</p>
							<div className="flex flex-wrap gap-2">
								{product.colors.map((c) => (
									<Badge key={c} variant="outline">
										{humanizeSpecKey(c.replaceAll("-", " "))}
									</Badge>
								))}
							</div>
						</div>
					) : null}
					{product.sizeOptions?.length ? (
						<div>
							<p className="text-muted-foreground mb-2 font-medium">Sizes</p>
							<div className="flex flex-wrap gap-2">
								{product.sizeOptions.map((s) => (
									<Badge key={s} variant="secondary">
										{s}
									</Badge>
								))}
							</div>
						</div>
					) : null}
				</div>
			) : null}

			<Button
				type="button"
				size="lg"
				className="w-full sm:w-auto"
				disabled={!product.inStock}
			>
				{product.inStock ? "Add to cart" : "Unavailable"}
			</Button>

			<dl className="text-muted-foreground grid gap-2 text-xs sm:grid-cols-2">
				<div>
					<dt className="font-medium">SKU</dt>
					<dd className="text-foreground tabular-nums">{product.sku}</dd>
				</div>
				<div>
					<dt className="font-medium">Barcode</dt>
					<dd className="text-foreground tabular-nums">{product.barcode}</dd>
				</div>
			</dl>
		</div>
	);
}
