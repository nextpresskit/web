import { describe, expect, it } from "vitest";
import { absoluteUrl, DEFAULT_DEV_SITE_URL, resolveSiteUrl } from "./siteUrl";

describe("resolveSiteUrl", () => {
	it.each([
		[
			{ VITE_SITE_URL: "https://nextpresskit.example/", DEV: false },
			"https://nextpresskit.example",
		],
		[{ VITE_SITE_URL: "  https://a.test//  ", DEV: true }, "https://a.test"],
		[{ DEV: true }, DEFAULT_DEV_SITE_URL],
		[{ DEV: false }, undefined],
		[{ VITE_SITE_URL: "", DEV: false }, undefined],
	])("%o → %s", (env, expected) => {
		expect(resolveSiteUrl(env)).toBe(expected);
	});
});

describe("absoluteUrl", () => {
	const site = "https://shop.example";
	it.each([
		["/demo/blog/cover.svg", site, "https://shop.example/demo/blog/cover.svg"],
		["demo/shop/tote.svg", site, "https://shop.example/demo/shop/tote.svg"],
		["https://cdn.test/a.png", null, "https://cdn.test/a.png"],
		["/demo/a.svg", null, undefined],
		["", site, undefined],
		[null, site, undefined],
	])("%s with %s → %s", (input, siteUrl, expected) => {
		expect(absoluteUrl(input, siteUrl)).toBe(expected);
	});
});
