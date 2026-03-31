import { createFileRoute, Link } from "@tanstack/react-router";
import { SearchIcon, SlidersHorizontalIcon } from "lucide-react";
import { useMemo, useState } from "react";

import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";
import { Checkbox } from "#/components/ui/checkbox";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { Separator } from "#/components/ui/separator";
import { Slider } from "#/components/ui/slider";
import { formatProductPrice, PRODUCTS, type Product } from "#/lib/products";

export const Route = createFileRoute("/(main)/_layout/shop/products")({
	component: ShopProductsPage,
});

const PRICE_MIN = 0;
const PRICE_MAX = Math.max(...PRODUCTS.map((p) => p.price), 100);

function ProductCard({ product }: { product: Product }) {
	return (
		<Card className="overflow-hidden pt-0">
			<Link
				to="/shop/$productId"
				params={{ productId: product.slug }}
				className="bg-muted block aspect-4/3 w-full overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-ring"
			>
				<img
					src={product.imageUrl}
					alt=""
					className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
					decoding="async"
					loading="lazy"
				/>
			</Link>
			<CardHeader className="gap-2">
				<div className="flex flex-wrap items-start justify-between gap-2">
					<CardTitle className="text-lg leading-snug">
						<Link
							to="/shop/$productId"
							params={{ productId: product.slug }}
							className="hover:text-primary focus-visible:ring-ring rounded-sm outline-none focus-visible:ring-2"
						>
							{product.name}
						</Link>
					</CardTitle>
					<Badge variant="secondary">{product.category}</Badge>
				</div>
				<CardDescription className="line-clamp-2">
					{product.description}
				</CardDescription>
			</CardHeader>
			<CardContent className="pt-0">
				<p className="text-xl font-semibold tabular-nums">
					{formatProductPrice(product.price, product.currency)}
				</p>
			</CardContent>
			<CardFooter className="flex flex-col gap-2 border-t pt-6 sm:flex-row">
				<Button className="w-full sm:flex-1" variant="default" asChild>
					<Link to="/shop/$productId" params={{ productId: product.slug }}>
						View details
					</Link>
				</Button>
				<Button className="w-full sm:flex-1" variant="outline" type="button">
					Add to cart
				</Button>
			</CardFooter>
		</Card>
	);
}

function ShopProductsPage() {
	const categories = useMemo(() => {
		const set = new Set<string>();
		for (const p of PRODUCTS) {
			set.add(p.category);
		}
		return [...set].sort((a, b) => a.localeCompare(b));
	}, []);

	const [search, setSearch] = useState("");
	const [maxPrice, setMaxPrice] = useState(PRICE_MAX);
	const [categoryFilters, setCategoryFilters] = useState<
		Record<string, boolean>
	>(
		() =>
			Object.fromEntries(categories.map((c) => [c, false])) as Record<
				string,
				boolean
			>,
	);

	const activeCategories = useMemo(
		() => categories.filter((c) => categoryFilters[c]),
		[categories, categoryFilters],
	);

	const filteredProducts = useMemo(() => {
		const q = search.trim().toLowerCase();
		return PRODUCTS.filter((p) => {
			if (p.price > maxPrice) {
				return false;
			}
			if (
				activeCategories.length > 0 &&
				!activeCategories.includes(p.category)
			) {
				return false;
			}
			if (q) {
				const haystack = `${p.name} ${p.description}`.toLowerCase();
				if (!haystack.includes(q)) {
					return false;
				}
			}
			return true;
		});
	}, [search, maxPrice, activeCategories]);

	function toggleCategory(cat: string) {
		setCategoryFilters((prev) => ({ ...prev, [cat]: !prev[cat] }));
	}

	function resetFilters() {
		setSearch("");
		setMaxPrice(PRICE_MAX);
		setCategoryFilters(
			Object.fromEntries(categories.map((c) => [c, false])) as Record<
				string,
				boolean
			>,
		);
	}

	const hasActiveFilters =
		search.trim() !== "" || maxPrice < PRICE_MAX || activeCategories.length > 0;

	return (
		<div className="mx-auto w-full max-w-7xl px-4 py-10 md:px-6">
			<header className="mb-8 space-y-2">
				<h1 className="text-3xl font-semibold tracking-tight">Shop products</h1>
				<p className="text-muted-foreground text-sm md:text-base">
					Browse the collection. Use the sidebar to filter by search, category,
					and price.
				</p>
			</header>

			<div className="flex flex-col gap-10 lg:flex-row lg:items-start">
				<aside
					className="bg-card w-full shrink-0 space-y-6 rounded-xl border p-6 shadow-sm lg:sticky lg:top-20 lg:w-72"
					aria-label="Product filters"
				>
					<div className="flex items-center gap-2 text-sm font-medium">
						<SlidersHorizontalIcon className="text-muted-foreground size-4" />
						Filters
					</div>
					<Separator />

					<div className="space-y-2">
						<Label htmlFor="product-search">Search</Label>
						<div className="relative">
							<SearchIcon className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
							<Input
								id="product-search"
								placeholder="Name or description…"
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								className="pl-9"
								autoComplete="off"
							/>
						</div>
					</div>

					<Separator />

					<div className="space-y-3">
						<p className="text-sm font-medium">Category</p>
						<div className="space-y-3">
							{categories.map((cat) => (
								<div key={cat} className="flex items-center gap-2">
									<Checkbox
										id={`cat-${cat}`}
										checked={!!categoryFilters[cat]}
										onCheckedChange={() => toggleCategory(cat)}
									/>
									<Label htmlFor={`cat-${cat}`} className="font-normal">
										{cat}
									</Label>
								</div>
							))}
						</div>
						<p className="text-muted-foreground text-xs">
							Leave all unchecked to show every category.
						</p>
					</div>

					<Separator />

					<div className="space-y-3">
						<div className="flex items-center justify-between gap-2">
							<p className="text-sm font-medium">Max price</p>
							<span className="text-muted-foreground text-xs tabular-nums">
								{formatProductPrice(maxPrice)}
							</span>
						</div>
						<Slider
							min={PRICE_MIN}
							max={PRICE_MAX}
							step={1}
							value={[maxPrice]}
							onValueChange={(v) => setMaxPrice(v[0] ?? PRICE_MAX)}
							aria-label="Maximum price"
						/>
						<div className="text-muted-foreground flex justify-between text-xs tabular-nums">
							<span>{formatProductPrice(PRICE_MIN)}</span>
							<span>{formatProductPrice(PRICE_MAX)}</span>
						</div>
					</div>

					{hasActiveFilters ? (
						<>
							<Separator />
							<Button
								type="button"
								variant="outline"
								className="w-full"
								onClick={resetFilters}
							>
								Reset filters
							</Button>
						</>
					) : null}
				</aside>

				<section className="min-w-0 flex-1" aria-live="polite">
					<p className="text-muted-foreground mb-6 text-sm">
						Showing{" "}
						<span className="text-foreground font-medium tabular-nums">
							{filteredProducts.length}
						</span>{" "}
						{filteredProducts.length === 1 ? "product" : "products"}
					</p>

					{filteredProducts.length > 0 ? (
						<ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
							{filteredProducts.map((product) => (
								<li key={product.id}>
									<ProductCard product={product} />
								</li>
							))}
						</ul>
					) : (
						<div className="bg-muted/40 text-muted-foreground rounded-xl border border-dashed px-6 py-16 text-center text-sm">
							No products match these filters. Try clearing a filter or
							resetting.
						</div>
					)}
				</section>
			</div>
		</div>
	);
}
