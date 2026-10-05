import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { FileQuestion } from "lucide-react";
import {
	EmptyState,
	ErrorState,
	LoadingState,
} from "#/components/admin/QueryState";
import { Button } from "#/components/ui/button";
import { BlogPostEditForm } from "#/features/admin/blog/posts/edit/BlogPostEditForm";
import { getApiErrorStatus } from "#/lib/axios/clientAxios";
import { adminPostQueryOptions } from "#/services/admin/posts/postsServices";

export const Route = createFileRoute("/admin/_layout/blog/posts/$postId")({
	component: SinglePostPage,
});

function SinglePostPage() {
	const { postId } = Route.useParams();
	const { data, isPending, isError, error, refetch, isFetching } = useQuery(
		adminPostQueryOptions(postId),
	);

	if (isPending) {
		return <LoadingState label="Loading post…" rows={6} />;
	}
	if (isError) {
		if (getApiErrorStatus(error) === 404) {
			return (
				<EmptyState
					icon={FileQuestion}
					title="Post not found"
					description={`There is no post with id ${postId}. It may have been deleted.`}
				>
					<Button asChild variant="outline">
						<Link to="/admin/blog/posts">Back to posts</Link>
					</Button>
				</EmptyState>
			);
		}
		return (
			<ErrorState
				title="Could not load post"
				error={error}
				onRetry={isFetching ? undefined : () => void refetch()}
			/>
		);
	}
	return <BlogPostEditForm key={data.id} post={data} />;
}
