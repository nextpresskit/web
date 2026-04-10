import { createFileRoute, notFound } from "@tanstack/react-router";
import initalData from "@/dummy_data/admin/blog_posts_list.json";
import { BlogPostEditForm } from "@/features/admin/blog/posts/edit/BlogPostEditForm";

export const Route = createFileRoute("/admin/_layout/blog/posts/$postId")({
	component: SinglePostPage,
});

function SinglePostPage() {
	const { postId } = Route.useParams();
	const post = initalData.find((row) => row.id === Number(postId));
	if (!post) {
		throw notFound();
	}
	return <BlogPostEditForm key={post.id} post={post} />;
}
