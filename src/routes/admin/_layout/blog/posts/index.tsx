import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import {
	AdminPageHeader,
	EmptyState,
	ErrorState,
	LoadingState,
} from "@/components/admin/QueryState";
import { PostsTableAdmin } from "@/features/admin/blog/posts/list/PostsTableAdmin";
import { adminPostsQueryOptions } from "@/services/admin/posts/postsServices";

export const Route = createFileRoute("/admin/_layout/blog/posts/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { data, isPending, isError, error, refetch, isFetching } = useQuery(
		adminPostsQueryOptions,
	);

	return (
		<div className="flex w-full flex-col gap-6 pb-6">
			<AdminPageHeader
				title="Posts"
				description="Articles stored in the NextPressKit backend."
			/>
			{isPending ? (
				<LoadingState label="Loading posts…" />
			) : isError ? (
				<ErrorState
					title="Could not load posts"
					error={error}
					onRetry={isFetching ? undefined : () => void refetch()}
				/>
			) : data.length === 0 ? (
				<EmptyState
					icon={FileText}
					title="No posts yet"
					description="Posts you create through the backend API will appear here."
				/>
			) : (
				<PostsTableAdmin data={data} />
			)}
		</div>
	);
}
