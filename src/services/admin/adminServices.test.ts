import type { InternalAxiosRequestConfig } from "axios";
import { afterEach, describe, expect, it } from "vitest";
import { clientAxios } from "#/lib/axios/clientAxios";
import { fetchAdminPost, fetchAdminPosts } from "./posts/postsServices";
import { fetchAdminUsers } from "./users/usersServices";

const originalAdapter = clientAxios.defaults.adapter;
const calls: InternalAxiosRequestConfig[] = [];

function respondWith(data: unknown) {
	clientAxios.defaults.adapter = async (config) => {
		calls.push(config);
		return { data, status: 200, statusText: "OK", headers: {}, config };
	};
}

afterEach(() => {
	if (originalAdapter) {
		clientAxios.defaults.adapter = originalAdapter;
	}
	calls.length = 0;
});

const row = (id: number) => ({
	id,
	uuid: `u${id}`,
	title: `Post ${id}`,
	slug: `post-${id}`,
	status: "draft",
	createdAt: "2026-10-05T00:00:00Z",
});

describe("admin posts service", () => {
	it("requests one extra row and maps a page", async () => {
		respondWith({ posts: [row(1), row(2), row(3)] });
		const page = await fetchAdminPosts({
			page: 3,
			q: "  seed ",
			status: "draft",
			pageSize: 2,
		});
		expect(calls[0]?.url).toBe("/admin/posts");
		expect(calls[0]?.params).toEqual({
			limit: 3,
			offset: 4,
			q: "seed",
			status: "draft",
		});
		expect(page.items.map((p) => p.id)).toEqual([1, 2]);
		expect(page.hasNextPage).toBe(true);
	});

	it("omits empty filters", async () => {
		respondWith({ posts: [] });
		await fetchAdminPosts({ page: 1, q: " " });
		expect(calls[0]?.params).toEqual({ limit: 21, offset: 0 });
	});

	it("rejects an unexpected body", async () => {
		respondWith([row(1)]);
		await expect(fetchAdminPosts({ page: 1 })).rejects.toThrow(
			"Unexpected response from GET /admin/posts.",
		);
	});

	it("loads one post by id", async () => {
		respondWith(row(5));
		const post = await fetchAdminPost("5");
		expect(calls[0]?.url).toBe("/admin/posts/5");
		expect(post.title).toBe("Post 5");
	});
});

describe("admin users service", () => {
	it("pages with the backend total", async () => {
		respondWith({
			users: [
				{
					id: 21,
					uuid: "u21",
					firstName: "Ada",
					lastName: "Lovelace",
					email: "ada@example.test",
					active: true,
					roles: ["editor"],
				},
			],
			total: 21,
			limit: 20,
			offset: 20,
		});
		const page = await fetchAdminUsers({ page: 2, q: "ada" });
		expect(calls[0]?.url).toBe("/admin/users");
		expect(calls[0]?.params).toEqual({ limit: 20, offset: 20, q: "ada" });
		expect(page.total).toBe(21);
		expect(page.hasNextPage).toBe(false);
		expect(page.items[0]?.fullName).toBe("Ada Lovelace");
	});

	it("rejects a body without users/total", async () => {
		respondWith({ users: [] });
		await expect(fetchAdminUsers({ page: 1 })).rejects.toThrow(
			"Unexpected response from GET /admin/users.",
		);
	});
});
