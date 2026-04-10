import { createFileRoute } from "@tanstack/react-router";
import { AdminBlogCategoriesList } from "@/features/admin/blog/categories/list/AdminBlogCategoriesList";

export const Route = createFileRoute("/admin/_layout/blog/categories/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <AdminBlogCategoriesList />;
}
