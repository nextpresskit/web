import { useQuery } from "@tanstack/react-query";
import {
	createFileRoute,
	stripSearchParams,
	useNavigate,
} from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { useCallback } from "react";
import { z } from "zod";
import { ListSearch, PaginationBar } from "#/components/admin/ListControls";
import {
	AdminPageHeader,
	EmptyState,
	ErrorState,
	LoadingState,
} from "#/components/admin/QueryState";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select";
import { PostsTableAdmin } from "#/features/admin/blog/posts/list/PostsTableAdmin";
import {
	ADMIN_POST_STATUSES,
	postStatusLabel,
} from "#/features/admin/blog/posts/postStatus";
import {
	ADMIN_POSTS_PAGE_SIZE,
	adminPostsQueryOptions,
} from "#/services/admin/posts/postsServices";

const ALL_STATUSES = "all";

const searchSchema = z.object({
	page: z.coerce.number().int().min(1).catch(1).default(1),
	q: z.string().trim().max(100).catch("").default(""),
	status: z.enum(ADMIN_POST_STATUSES).optional().catch(undefined),
});

export const Route = createFileRoute("/admin/_layout/blog/posts/")({
	validateSearch: searchSchema,
	search: { middlewares: [stripSearchParams({ page: 1, q: "" })] },
	component: RouteComponent,
});

function RouteComponent() {
	const { page, q, status } = Route.useSearch();
	const navigate = useNavigate({ from: Route.fullPath });
	const { data, isPending, isError, error, refetch, isFetching } = useQuery(
		adminPostsQueryOptions({ page, q, status }),
	);

	const onSearch = useCallback(
		(value: string) =>
			void navigate({ search: (prev) => ({ ...prev, q: value, page: 1 }) }),
		[navigate],
	);
	const filtered = Boolean(q || status);

	const toolbar = (
		<>
			<ListSearch
				value={q}
				onSearch={onSearch}
				label="Search posts"
				placeholder="Search title or content…"
			/>
			<Select
				value={status ?? ALL_STATUSES}
				onValueChange={(value) =>
					void navigate({
						search: (prev) => ({
							...prev,
							page: 1,
							status:
								value === ALL_STATUSES
									? undefined
									: (value as (typeof ADMIN_POST_STATUSES)[number]),
						}),
					})
				}
			>
				<SelectTrigger className="w-full sm:w-40" aria-label="Filter by status">
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value={ALL_STATUSES}>All statuses</SelectItem>
					{ADMIN_POST_STATUSES.map((value) => (
						<SelectItem key={value} value={value}>
							{postStatusLabel(value)}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</>
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
			) : data.items.length === 0 && page === 1 && !filtered ? (
				<EmptyState
					icon={FileText}
					title="No posts yet"
					description="Posts you create through the backend API will appear here."
				/>
			) : (
				<>
					<PostsTableAdmin posts={data.items} toolbar={toolbar} />
					<PaginationBar
						page={page}
						pageSize={ADMIN_POSTS_PAGE_SIZE}
						itemCount={data.items.length}
						total={data.total}
						hasNextPage={data.hasNextPage}
						isFetching={isFetching}
						noun="posts"
						onPageChange={(next) =>
							void navigate({ search: (prev) => ({ ...prev, page: next }) })
						}
					/>
				</>
			)}
		</div>
	);
}
