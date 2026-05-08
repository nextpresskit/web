import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { PostsTableAdmin } from "@/features/admin/blog/posts/list/PostsTableAdmin";
import { adminPostsQueryOptions } from "@/services/admin/posts/postsServices";

export const Route = createFileRoute("/admin/_layout/blog/posts/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { data = [], isPending, isError } = useQuery(adminPostsQueryOptions);

	if (isPending) {
		return <div className="px-4 lg:px-6 py-4">Loading posts...</div>;
	}

	if (isError) {
		return <div className="px-4 lg:px-6 py-4">Failed to load posts.</div>;
	}

	return <PostsTableAdmin data={data} />;
}
