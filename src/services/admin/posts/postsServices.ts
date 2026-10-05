import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import type { AdminPage, AdminPost } from "#/@types/admin";
import type { ApiAdminPostsResponse, ApiPost } from "#/@types/api";
import { clientAxios } from "#/lib/axios/clientAxios";
import { toAdminPost, toPageFromOverfetch } from "#/services/admin/adapters";

export const ADMIN_POSTS_PAGE_SIZE = 20;

export type AdminPostsParams = {
	page: number;
	q?: string | undefined;
	status?: string | undefined;
	pageSize?: number | undefined;
};

/**
 * `GET /admin/posts` (docs/openapi.yaml) → `{ posts }` with `limit`/`offset`
 * and no total, so one extra row is requested to know whether a next page exists.
 */
export async function fetchAdminPosts({
	page,
	q,
	status,
	pageSize = ADMIN_POSTS_PAGE_SIZE,
}: AdminPostsParams): Promise<AdminPage<AdminPost>> {
	const offset = (Math.max(1, page) - 1) * pageSize;
	const response = await clientAxios.get<ApiAdminPostsResponse>(
		"/admin/posts",
		{
			params: {
				limit: pageSize + 1,
				offset,
				...(q?.trim() ? { q: q.trim() } : {}),
				...(status ? { status } : {}),
			},
		},
	);
	const posts = response.data?.posts;
	if (!Array.isArray(posts)) {
		throw new Error("Unexpected response from GET /admin/posts.");
	}
	return toPageFromOverfetch(posts, pageSize, offset, toAdminPost);
}

/** `GET /admin/posts/{id}` (numeric id or uuid) → post object. */
export async function fetchAdminPost(id: string): Promise<AdminPost> {
	const response = await clientAxios.get<ApiPost>(
		`/admin/posts/${encodeURIComponent(id)}`,
	);
	if (!response.data || typeof response.data.id !== "number") {
		throw new Error("Unexpected response from GET /admin/posts/{id}.");
	}
	return toAdminPost(response.data);
}

export const adminPostsQueryKey = ["admin", "posts"] as const;

export const adminPostsQueryOptions = (params: AdminPostsParams) =>
	queryOptions({
		queryKey: [
			...adminPostsQueryKey,
			"list",
			{
				page: params.page,
				q: params.q ?? "",
				status: params.status ?? "",
				pageSize: params.pageSize ?? ADMIN_POSTS_PAGE_SIZE,
			},
		],
		queryFn: () => fetchAdminPosts(params),
		placeholderData: keepPreviousData,
	});

export const adminPostQueryOptions = (id: string) =>
	queryOptions({
		queryKey: [...adminPostsQueryKey, "detail", id],
		queryFn: () => fetchAdminPost(id),
	});

export type AdminPostUpdate = {
	title: string;
	slug: string;
	status: string;
	content: string;
	seo: {
		title: string;
		description: string;
		canonicalUrl: string;
		robots: string;
		ogType: string;
		ogImage: string;
		twitterCard: string;
		structuredData: Record<string, unknown> | null;
	};
};

/**
 * Saves the editable fields: `PUT /admin/posts/{id}` (title, slug, content,
 * status) then `PUT /admin/posts/{id}/seo`. Returns the post as reloaded.
 */
export async function updateAdminPost(
	id: number,
	update: AdminPostUpdate,
): Promise<AdminPost> {
	await clientAxios.put<ApiPost>(`/admin/posts/${id}`, {
		title: update.title,
		slug: update.slug,
		content: update.content,
		status: update.status,
	});
	await clientAxios.put(`/admin/posts/${id}/seo`, update.seo);
	return fetchAdminPost(String(id));
}

/** `DELETE /admin/posts/{id}` */
export async function deleteAdminPost(id: number): Promise<void> {
	await clientAxios.delete(`/admin/posts/${id}`);
}
