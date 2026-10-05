import { describe, expect, it } from "vitest";
import type { ApiAdminUser, ApiPost } from "#/@types/api";
import {
	initialsOf,
	toAdminPost,
	toAdminUser,
	toPageFromOverfetch,
	toPageWithTotal,
	toPersonRef,
} from "./adapters";

/** Trimmed copy of a real `GET /admin/posts` row from the seeded backend. */
const apiPost: ApiPost = {
	id: 1,
	uuid: "00000000-0000-0000-0700-000000000001",
	authorId: "1",
	author: {
		id: "1",
		uuid: "00000000-0000-0000-0100-000000000001",
		displayName: "Super Admin",
		email: "superadmin@nextpresskit.local",
	},
	title: "Seed Post 001",
	slug: "seed-post-001",
	subtitle: "Subtitle for post 001",
	excerpt: "Short excerpt for post 001",
	content: "Seeded content body for post 001.",
	type: "article",
	format: "standard",
	visibility: "public",
	locale: "en-US",
	status: "draft",
	revision: 1,
	categories: [
		{ id: "c1", name: "Category 001", slug: "category-001", isPrimary: true },
	],
	category: null,
	tags: [{ id: "t1", name: "Tag 001", slug: "tag-001" }],
	featuredImage: { url: "/uploads/seed-image-001.jpg", alt: "Featured alt" },
	seo: {
		title: "SEO Title 001",
		description: "SEO Description 001",
		canonicalUrl: null,
		robots: "index,follow",
		ogType: "article",
		ogImage: null,
		twitterCard: "summary_large_image",
		structuredData: { seed_index: 1 },
	},
	metrics: { wordCount: 801, readingTimeMinutes: 5 },
	createdAt: "2026-10-05T22:28:15.359782+03:00",
	updatedAt: "2026-10-05T22:28:15.359782+03:00",
	publishedAt: null,
	scheduledPublishAt: "2026-10-05T23:28:15.359782+03:00",
};

describe("toAdminPost", () => {
	it("maps a full backend post", () => {
		const post = toAdminPost(apiPost);
		expect(post).toMatchObject({
			id: 1,
			title: "Seed Post 001",
			status: "draft",
			content: "Seeded content body for post 001.",
			author: {
				id: "1",
				name: "Super Admin",
				email: "superadmin@nextpresskit.local",
			},
			categories: [{ id: "c1", name: "Category 001", slug: "category-001" }],
			primaryCategory: { id: "c1", name: "Category 001" },
			tags: [{ id: "t1", name: "Tag 001", slug: "tag-001" }],
			featuredImageUrl: "/uploads/seed-image-001.jpg",
			wordCount: 801,
			readingTimeMinutes: 5,
			publishedAt: null,
		});
		expect(post.seo).toEqual({
			title: "SEO Title 001",
			description: "SEO Description 001",
			canonicalUrl: "",
			robots: "index,follow",
			ogType: "article",
			ogImage: "",
			twitterCard: "summary_large_image",
			structuredData: { seed_index: 1 },
		});
	});

	it("fills defaults for a sparse list row (older backends)", () => {
		const post = toAdminPost({
			id: 9,
			uuid: "u9",
			title: "Bare",
			slug: "bare",
			status: "PUBLISHED",
			authorId: "4",
			author: null,
			seo: null,
			metrics: null,
			createdAt: "2026-01-01T00:00:00Z",
		});
		expect(post.status).toBe("published");
		expect(post.author).toEqual({ id: "4", name: "User #4", email: null });
		expect(post.categories).toEqual([]);
		expect(post.tags).toEqual([]);
		expect(post.primaryCategory).toBeNull();
		expect(post.featuredImageUrl).toBeNull();
		expect(post.wordCount).toBeNull();
		expect(post.seo.title).toBe("Bare");
		expect(post.seo.robots).toBe("index,follow");
		expect(post.seo.structuredData).toBeNull();
		expect(post.content).toBe("");
	});

	it("ignores non-object structured data", () => {
		const post = toAdminPost({ ...apiPost, seo: { structuredData: [1, 2] } });
		expect(post.seo.structuredData).toBeNull();
	});
});

describe("toPersonRef", () => {
	it.each([
		[{ id: "2", displayName: "  ", email: "x@y.test" }, undefined, "x@y.test"],
		[{ id: "3" }, undefined, "User #3"],
		[null, "7", "User #7"],
	])("%o (fallback %s) → %s", (summary, fallback, name) => {
		expect(toPersonRef(summary, fallback)?.name).toBe(name);
	});

	it("returns null without any id", () => {
		expect(toPersonRef(null, "")).toBeNull();
	});
});

describe("toAdminUser", () => {
	const base: ApiAdminUser = {
		id: 1,
		uuid: "u1",
		firstName: "Super",
		lastName: "Admin",
		email: "superadmin@nextpresskit.local",
		active: true,
		roles: ["superadmin", "admin"],
		createdAt: "2026-10-05T19:28:13Z",
	};

	it("builds names, initials and sorted roles", () => {
		expect(toAdminUser(base)).toEqual({
			id: 1,
			uuid: "u1",
			firstName: "Super",
			lastName: "Admin",
			fullName: "Super Admin",
			initials: "SA",
			email: "superadmin@nextpresskit.local",
			active: true,
			roles: ["admin", "superadmin"],
			createdAt: "2026-10-05T19:28:13Z",
		});
	});

	it("falls back to the e-mail when names are blank", () => {
		const user = toAdminUser({
			...base,
			firstName: " ",
			lastName: "",
			roles: null,
		});
		expect(user.fullName).toBe("superadmin@nextpresskit.local");
		expect(user.initials).toBe("S");
		expect(user.roles).toEqual([]);
	});
});

describe("initialsOf", () => {
	it.each([
		[["ada", "lovelace"], "AL"],
		[["", "x"], "X"],
		[[null, undefined], "?"],
	])("%o → %s", (parts, expected) => {
		expect(initialsOf(...parts)).toBe(expected);
	});
});

describe("pages", () => {
	it("overfetch drops the probe row and reports a next page", () => {
		const page = toPageFromOverfetch([1, 2, 3], 2, 4, (n) => n * 10);
		expect(page).toEqual({
			items: [10, 20],
			total: null,
			limit: 2,
			offset: 4,
			hasNextPage: true,
		});
		expect(toPageFromOverfetch([1], 2, 0, (n) => n).hasNextPage).toBe(false);
	});

	it.each([
		[[1, 2], 5, 0, true],
		[[3, 4], 4, 2, false],
		[[], 0, 0, false],
	])("with total: rows %o of %d at %d → next %s", (rows, total, offset, next) => {
		expect(toPageWithTotal(rows, total, 2, offset, (n) => n).hasNextPage).toBe(
			next,
		);
	});
});
