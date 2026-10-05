import { describe, expect, it } from "vitest";
import { buildAdminBreadcrumbs } from "./adminSidebarNav";

describe("buildAdminBreadcrumbs", () => {
	it("labels known sections and links only real pages", () => {
		expect(buildAdminBreadcrumbs("/admin/blog/posts")).toEqual([
			{ label: "Blog", path: "/admin/blog", href: undefined },
			{ label: "Posts", path: "/admin/blog/posts", href: "/admin/blog/posts" },
		]);
	});

	it("shows record ids for detail pages", () => {
		expect(buildAdminBreadcrumbs("/admin/blog/posts/42").at(-1)).toEqual({
			label: "#42",
			path: "/admin/blog/posts/42",
			href: undefined,
		});
	});

	it("handles locale prefixes and non-admin paths", () => {
		expect(buildAdminBreadcrumbs("/de/admin/users")).toEqual([
			{ label: "Users", path: "/admin/users", href: "/admin/users" },
		]);
		expect(buildAdminBreadcrumbs("/blog")).toEqual([]);
	});
});
