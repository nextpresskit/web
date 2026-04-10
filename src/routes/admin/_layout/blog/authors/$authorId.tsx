import { createFileRoute, notFound } from "@tanstack/react-router";
import authorsData from "@/dummy_data/admin/blog_authors_list.json";
import { BlogAuthorEditAdmin } from "@/features/admin/blog/authors/edit/BlogAuthorEditAdmin";
import { blogAuthorListItemSchema } from "@/features/admin/blog/schema";

export const Route = createFileRoute("/admin/_layout/blog/authors/$authorId")({
	component: RouteComponent,
});

function RouteComponent() {
	const { authorId } = Route.useParams();
	const parsed = blogAuthorListItemSchema.array().safeParse(authorsData);
	if (!parsed.success) {
		throw new Error("Invalid blog authors data");
	}
	const authors = parsed.data;
	const author = authors.find((a) => a.id === authorId);
	if (!author) {
		throw notFound();
	}
	return <BlogAuthorEditAdmin key={author.id} author={author} />;
}
