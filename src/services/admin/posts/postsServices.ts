import { queryOptions } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import type { BlogPosts } from "@/features/admin/blog/schema";
import { clientAxios } from "@/lib/axios/clientAxios";

/** Backend contract (docs/openapi.yaml): `GET /admin/posts` → `{ posts: Post[] }`. */
export type AdminPostsResponse = { posts: BlogPosts[] };

export const getPostsAdmin = (): Promise<AxiosResponse<AdminPostsResponse>> =>
	clientAxios.get<AdminPostsResponse>("/admin/posts");

export const adminPostsQueryKey = ["admin", "posts"] as const;

export const adminPostsQueryOptions = queryOptions({
	queryKey: adminPostsQueryKey,
	queryFn: async () => {
		const response = await getPostsAdmin();
		const posts = response.data?.posts;
		if (!Array.isArray(posts)) {
			throw new Error("Unexpected response from GET /admin/posts.");
		}
		return posts;
	},
});
