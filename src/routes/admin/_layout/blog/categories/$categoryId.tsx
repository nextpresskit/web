import { createFileRoute, notFound } from "@tanstack/react-router";
import categoriesData from "@/dummy_data/admin/blog_categoires_list.json";
import { BlogCategoryEditForm } from "@/features/admin/blog/categories/edit/BlogCategoryEditForm";
import { blogCategoryListItemSchema } from "@/features/admin/blog/schema";

export const Route = createFileRoute(
	"/admin/_layout/blog/categories/$categoryId",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const { categoryId } = Route.useParams();
	const parsed = blogCategoryListItemSchema.array().safeParse(categoriesData);
	if (!parsed.success) {
		throw new Error("Invalid blog categories data");
	}
	const allCategories = parsed.data;
	const category = allCategories.find((c) => c.id === Number(categoryId));
	if (!category) {
		throw notFound();
	}
	return (
		<BlogCategoryEditForm
			key={category.id}
			category={category}
			allCategories={allCategories}
		/>
	);
}
