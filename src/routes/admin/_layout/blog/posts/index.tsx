import { createFileRoute } from "@tanstack/react-router";
import { PostsTableAdmin } from "@/features/admin/blog/posts/list/PostsTableAdmin";

export const Route = createFileRoute("/admin/_layout/blog/posts/")({
	component: RouteComponent,
});

const initalData = await import("@/dummy_data/admin/blog_posts_list.json").then(
	async (module) => module.default,
);

function RouteComponent() {
	return <PostsTableAdmin data={initalData} />;
}
