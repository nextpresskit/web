import { createFileRoute, Link } from "@tanstack/react-router";
import {
	ArrowRightIcon,
	PackageIcon,
	SparklesIcon,
	TruckIcon,
} from "lucide-react";
import { useMemo } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatProductPrice, PRODUCTS, type Product } from "@/helpers/products";

export const Route = createFileRoute("/(main)/_layout/shop/")({
	component: ShopHomePage,
});

function FeaturedProductCard({ product }: { product: Product }) {
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
					{product.shortDescription ?? product.description}
				</CardDescription>
			</CardHeader>
			<CardContent className="pt-0">
				<p className="text-xl font-semibold tabular-nums">
					{formatProductPrice(product.price, product.currency)}
				</p>
			</CardContent>
			<CardFooter className="border-t pt-6">
				<Button className="w-full" variant="default" asChild>
					<Link to="/shop/$productId" params={{ productId: product.slug }}>
						View details
					</Link>
				</Button>
			</CardFooter>
		</Card>
	);
}

function ShopHomePage() {
	const featuredProducts = useMemo(() => {
		const featured = PRODUCTS.filter((p: Product) => p.featured);
		return [...featured].sort((a, b) => b.rating - a.rating).slice(0, 4);
	}, []);

	const categories = useMemo(() => {
		const set = new Set<string>();
		for (const p of PRODUCTS) {
			set.add(p.category);
		}
		return [...set].sort((a, b) => a.localeCompare(b));
	}, []);

	const highlights = [
		{
			icon: TruckIcon,
			title: "Straightforward shipping",
			body: "Many items ship quickly from our US warehouse, with free shipping on eligible orders.",
		},
		{
			icon: PackageIcon,
			title: "Curated goods",
			body: "Stationery, apparel, and desk pieces selected for everyday use and long-term wear.",
		},
		{
			icon: SparklesIcon,
			title: "Easy returns",
			body: "Most products include a clear return window so you can shop with confidence.",
		},
	] as const;

	return (
		<div className="mx-auto w-full max-w-7xl px-4 py-10 md:px-6">
			<section className="relative overflow-hidden rounded-2xl border bg-linear-to-br from-muted/80 via-background to-background px-6 py-12 md:px-10 md:py-16">
				<div
					className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-primary/5 blur-3xl"
					aria-hidden
				/>
				<div className="relative max-w-2xl space-y-6">
					<Badge variant="outline" className="w-fit">
						NextPressKit shop
					</Badge>
					<h1 className="text-3xl font-semibold tracking-tight text-balance md:text-4xl">
						Tools and pieces for calm, focused days.
					</h1>
					<p className="text-muted-foreground text-base leading-relaxed md:text-lg">
						Browse notebooks, bags, desk accessories, and more—thoughtfully
						described so you know exactly what you are getting.
					</p>
					<div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
						<Button size="lg" asChild>
							<Link to="/shop/products" className="gap-2">
								Browse all products
								<ArrowRightIcon className="size-4" />
							</Link>
						</Button>
						<Button size="lg" variant="outline" asChild>
							<Link
								to="/shop/$productId"
								params={{
									productId:
										featuredProducts[0]?.slug ??
										PRODUCTS[0]?.slug ??
										"studio-notebook",
								}}
							>
								View a featured item
							</Link>
						</Button>
					</div>
					<p className="text-muted-foreground text-sm tabular-nums">
						{PRODUCTS.length} products · {categories.length}{" "}
						{categories.length === 1 ? "category" : "categories"}
					</p>
				</div>
			</section>

			<section className="mt-14" aria-labelledby="shop-highlights-heading">
				<h2 id="shop-highlights-heading" className="sr-only">
					Why shop here
				</h2>
				<ul className="grid gap-6 md:grid-cols-3">
					{highlights.map(({ icon: Icon, title, body }) => (
						<li key={title}>
							<Card className="h-full shadow-sm">
								<CardHeader className="space-y-3">
									<div className="bg-muted inline-flex size-10 items-center justify-center rounded-lg">
										<Icon className="text-primary size-5" aria-hidden />
									</div>
									<CardTitle className="text-base">{title}</CardTitle>
									<CardDescription className="text-sm leading-relaxed">
										{body}
									</CardDescription>
								</CardHeader>
							</Card>
						</li>
					))}
				</ul>
			</section>

			<section className="mt-14" aria-labelledby="featured-heading">
				<div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
					<div className="space-y-2">
						<h2
							id="featured-heading"
							className="text-2xl font-semibold tracking-tight"
						>
							Featured right now
						</h2>
						<p className="text-muted-foreground max-w-xl text-sm md:text-base">
							A rotating spotlight on customer favorites and standout pieces
							from the catalog.
						</p>
					</div>
					<Button variant="outline" asChild className="shrink-0">
						<Link to="/shop/products" className="gap-2">
							See everything
							<ArrowRightIcon className="size-4" />
						</Link>
					</Button>
				</div>

				<ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
					{featuredProducts.map((product) => (
						<li key={product.id}>
							<FeaturedProductCard product={product} />
						</li>
					))}
				</ul>
			</section>

			<section className="mt-14" aria-labelledby="categories-heading">
				<h2
					id="categories-heading"
					className="text-2xl font-semibold tracking-tight"
				>
					Shop by category
				</h2>
				<p className="text-muted-foreground mt-2 max-w-xl text-sm md:text-base">
					Jump into the full catalog and use filters to narrow down by category
					and price.
				</p>
				<div className="mt-6 flex flex-wrap gap-2">
					{categories.map((cat) => (
						<Badge key={cat} variant="secondary" className="px-3 py-1 text-sm">
							{cat}
						</Badge>
					))}
				</div>
				<div className="mt-8">
					<Separator className="mb-8" />
					<div className="bg-muted/40 flex flex-col items-start justify-between gap-4 rounded-xl border px-6 py-8 md:flex-row md:items-center">
						<div className="space-y-1">
							<p className="font-medium">Ready when you are</p>
							<p className="text-muted-foreground text-sm">
								Open the product grid to search, sort by filters, and compare
								options side by side.
							</p>
						</div>
						<Button asChild>
							<Link to="/shop/products" className="gap-2">
								Go to products
								<ArrowRightIcon className="size-4" />
							</Link>
						</Button>
					</div>
				</div>
			</section>
		</div>
	);
}
