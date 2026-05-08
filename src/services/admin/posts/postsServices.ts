import { queryOptions } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import type { BlogPosts } from "@/features/admin/blog/schema";
import { clientAxios } from "@/lib/axios/clientAxios";

export const getPostsAdmin = (): Promise<AxiosResponse<BlogPosts[]>> =>
	clientAxios.get<BlogPosts[]>("/admin/posts");

export const adminPostsQueryKey = ["admin", "posts"] as const;

export const adminPostsQueryOptions = queryOptions({
	queryKey: adminPostsQueryKey,
	queryFn: async () => {
		const response = await getPostsAdmin();
		return response.data;
	},
});
