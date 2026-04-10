import { createFileRoute } from "@tanstack/react-router";
import { BlogAuthorsTableAdmin } from "@/features/admin/blog/authors/list/BlogAuthorsListAdmin";

export const Route = createFileRoute("/admin/_layout/blog/authors/")({
	component: RouteComponent,
});

const initialData = await import("@/dummy_data/admin/blog_authors_list.json").then(
	(m) => m.default,
);

function RouteComponent() {
	return <BlogAuthorsTableAdmin data={initialData} />;
}
