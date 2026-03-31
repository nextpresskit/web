import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeftIcon } from "lucide-react";
import { useEffect } from "react";

import { ProductImageGallery } from "#/components/shop/product-detail/ProductImageGallery";
import { ProductMetaSections } from "#/components/shop/product-detail/ProductMetaSections";
import { ProductPurchasePanel } from "#/components/shop/product-detail/ProductPurchasePanel";
import { Button } from "#/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";
import { findProductByParam } from "#/lib/products";

export const Route = createFileRoute("/(main)/_layout/shop/$productId")({
	loader: ({ params }) => {
		const product = findProductByParam(params.productId);
		if (!product) {
			throw notFound();
		}
		return { product };
	},
	notFoundComponent: ProductNotFound,
	component: ProductPage,
});

function ProductNotFound() {
	return (
		<main className="mx-auto w-full max-w-2xl px-4 py-16">
			<Card>
				<CardHeader>
					<CardTitle>Product not found</CardTitle>
					<CardDescription>
						This link may be outdated, or the item is no longer available.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Button asChild>
						<Link to="/shop/products">Back to products</Link>
					</Button>
				</CardContent>
			</Card>
		</main>
	);
}

function ProductPage() {
	const { product } = Route.useLoaderData();
	const images =
		product.images?.length > 0 ? product.images : product.imageUrl
			? [product.imageUrl]
			: [];

	useEffect(() => {
		document.title = product.seoTitle;
		let meta = document.querySelector('meta[name="description"]');
		if (!meta) {
			meta = document.createElement("meta");
			meta.setAttribute("name", "description");
			document.head.appendChild(meta);
		}
		meta.setAttribute("content", product.seoDescription);
	}, [product.seoDescription, product.seoTitle]);

	return (
		<main className="mx-auto w-full max-w-7xl px-4 py-10 md:px-6">
			<Button variant="ghost" size="sm" className="mb-6 -ml-2 gap-1" asChild>
				<Link to="/shop/products">
					<ArrowLeftIcon className="size-4" />
					Products
				</Link>
			</Button>

			<div className="grid gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16">
				<ProductImageGallery images={images} productName={product.name} />
				<div className="min-w-0 lg:pt-2">
					<ProductPurchasePanel product={product} />
				</div>
			</div>

			<div className="mt-14 max-w-3xl border-t pt-10">
				<ProductMetaSections product={product} />
			</div>
		</main>
	);
}
