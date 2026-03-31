import productsFile from "#/dummy_data/products.json";

export const PRODUCTS = productsFile.products;
export type Product = (typeof productsFile.products)[number];

export function findProductByParam(param: string): Product | undefined {
	return PRODUCTS.find((p) => p.slug === param || p.id === param);
}

export function formatProductPrice(amount: number, currency = "USD"): string {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency,
		maximumFractionDigits: 0,
	}).format(amount);
}

function splitCamelOrSnake(key: string): string {
	return key
		.replace(/([a-z])([A-Z])/g, "$1 $2")
		.replace(/_/g, " ")
		.toLowerCase();
}

export function humanizeSpecKey(key: string): string {
	const spaced = splitCamelOrSnake(key);
	return spaced.replace(/\b\w/g, (c) => c.toUpperCase());
}

export function formatSpecValue(value: unknown): string {
	if (value === null || value === undefined) {
		return "—";
	}
	if (typeof value === "boolean") {
		return value ? "Yes" : "No";
	}
	if (Array.isArray(value)) {
		return value.map(String).join(", ");
	}
	if (typeof value === "number" && Number.isFinite(value)) {
		return value.toLocaleString("en-US");
	}
	return String(value);
}
