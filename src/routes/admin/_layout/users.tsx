import { useQuery } from "@tanstack/react-query";
import {
	createFileRoute,
	stripSearchParams,
	useNavigate,
} from "@tanstack/react-router";
import { Users } from "lucide-react";
import { useCallback } from "react";
import { z } from "zod";
import { ListSearch, PaginationBar } from "#/components/admin/ListControls";
import {
	AdminPageHeader,
	EmptyState,
	ErrorState,
	LoadingState,
} from "#/components/admin/QueryState";
import { UsersTableAdmin } from "#/features/admin/users/UsersTableAdmin";
import {
	ADMIN_USERS_PAGE_SIZE,
	adminUsersQueryOptions,
} from "#/services/admin/users/usersServices";

const searchSchema = z.object({
	page: z.coerce.number().int().min(1).catch(1).default(1),
	q: z.string().trim().max(100).catch("").default(""),
});

export const Route = createFileRoute("/admin/_layout/users")({
	validateSearch: searchSchema,
	search: { middlewares: [stripSearchParams({ page: 1, q: "" })] },
	component: RouteComponent,
});

/** Users from `GET /admin/users` (backend permission `users:read`). */
function RouteComponent() {
	const { page, q } = Route.useSearch();
	const navigate = useNavigate({ from: Route.fullPath });
	const { data, isPending, isError, error, refetch, isFetching } = useQuery(
		adminUsersQueryOptions({ page, q }),
	);

	const onSearch = useCallback(
		(value: string) =>
			void navigate({ search: (prev) => ({ ...prev, q: value, page: 1 }) }),
		[navigate],
	);

	return (
		<div className="flex w-full flex-col gap-6 pb-6">
			<AdminPageHeader
				title="Users"
				description="Accounts and roles stored in the NextPressKit backend."
			/>
			{isPending ? (
				<LoadingState label="Loading users…" />
			) : isError ? (
				<ErrorState
					title="Could not load users"
					error={error}
					onRetry={isFetching ? undefined : () => void refetch()}
				/>
			) : data.total === 0 && !q ? (
				<EmptyState
					icon={Users}
					title="No users yet"
					description={
						<>
							Accounts created with <code>POST /auth/register</code> or the
							backend seed command will appear here.
						</>
					}
				/>
			) : (
				<div className="flex flex-col gap-4">
					<div className="px-4 lg:px-6">
						<ListSearch
							value={q}
							onSearch={onSearch}
							label="Search users"
							placeholder="Search name or email…"
						/>
					</div>
					<UsersTableAdmin users={data.items} />
					<PaginationBar
						page={page}
						pageSize={ADMIN_USERS_PAGE_SIZE}
						itemCount={data.items.length}
						total={data.total}
						hasNextPage={data.hasNextPage}
						isFetching={isFetching}
						noun="users"
						onPageChange={(next) =>
							void navigate({ search: (prev) => ({ ...prev, page: next }) })
						}
					/>
				</div>
			)}
		</div>
	);
}
