import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { FileText, Users } from "lucide-react";
import { formatAdminDate } from "#/components/admin/ListControls";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";
import { Skeleton } from "#/components/ui/skeleton";
import {
	postStatusBadgeVariant,
	postStatusLabel,
} from "#/features/admin/blog/posts/postStatus";
import { getApiErrorMessage } from "#/lib/axios/clientAxios";
import { adminPostsQueryOptions } from "#/services/admin/posts/postsServices";
import { adminUsersQueryOptions } from "#/services/admin/users/usersServices";

const RECENT_POSTS = 5;
const SKELETON_KEYS = ["a", "b", "c", "d", "e"] as const;

/** Live numbers from the backend: user count, newest users and latest posts. */
export function ContentOverview() {
	const users = useQuery(adminUsersQueryOptions({ page: 1, pageSize: 5 }));
	const posts = useQuery(
		adminPostsQueryOptions({ page: 1, pageSize: RECENT_POSTS }),
	);

	return (
		<section
			aria-labelledby="content-heading"
			className="grid gap-6 lg:grid-cols-3"
		>
			<h2 id="content-heading" className="sr-only">
				Content in the backend
			</h2>

			<Card className="gap-4">
				<CardHeader className="flex flex-row items-start justify-between">
					<div className="space-y-1.5">
						<CardTitle>Users</CardTitle>
						<CardDescription>Accounts in the backend.</CardDescription>
					</div>
					<Users className="size-4 text-muted-foreground" aria-hidden />
				</CardHeader>
				<CardContent className="space-y-4">
					{users.isPending ? (
						<Skeleton className="h-8 w-24" />
					) : users.isError ? (
						<p className="text-destructive text-sm">
							{getApiErrorMessage(users.error)}
						</p>
					) : (
						<>
							<div className="font-semibold text-3xl tabular-nums">
								{(users.data.total ?? 0).toLocaleString()}
							</div>
							<ul className="space-y-2 text-sm">
								{users.data.items.map((user) => (
									<li
										key={user.uuid}
										className="flex items-center justify-between gap-2"
									>
										<span className="truncate">{user.fullName}</span>
										<span className="shrink-0 text-muted-foreground text-xs">
											{user.roles[0] ?? "no role"}
										</span>
									</li>
								))}
							</ul>
						</>
					)}
					<Button asChild variant="outline" size="sm">
						<Link to="/admin/users">Manage users</Link>
					</Button>
				</CardContent>
			</Card>

			<Card className="gap-4 lg:col-span-2">
				<CardHeader className="flex flex-row items-start justify-between">
					<div className="space-y-1.5">
						<CardTitle>Latest posts</CardTitle>
						<CardDescription>Newest articles, any status.</CardDescription>
					</div>
					<FileText className="size-4 text-muted-foreground" aria-hidden />
				</CardHeader>
				<CardContent className="space-y-4">
					{posts.isPending ? (
						<div className="space-y-2">
							{SKELETON_KEYS.map((key) => (
								<Skeleton key={key} className="h-6 w-full" />
							))}
						</div>
					) : posts.isError ? (
						<p className="text-destructive text-sm">
							{getApiErrorMessage(posts.error)}
						</p>
					) : posts.data.items.length === 0 ? (
						<p className="text-muted-foreground text-sm">No posts yet.</p>
					) : (
						<ul className="divide-y text-sm">
							{posts.data.items.map((post) => (
								<li
									key={post.id}
									className="flex flex-col gap-1 py-2 first:pt-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
								>
									<Link
										to="/admin/blog/posts/$postId"
										params={{ postId: String(post.id) }}
										className="min-w-0 truncate font-medium hover:underline"
									>
										{post.title}
									</Link>
									<div className="flex shrink-0 items-center gap-2 text-muted-foreground text-xs">
										<span className="truncate">{post.author?.name ?? "—"}</span>
										<span className="tabular-nums">
											{formatAdminDate(post.createdAt)}
										</span>
										<Badge variant={postStatusBadgeVariant(post.status)}>
											{postStatusLabel(post.status)}
										</Badge>
									</div>
								</li>
							))}
						</ul>
					)}
					<Button asChild variant="outline" size="sm">
						<Link to="/admin/blog/posts">All posts</Link>
					</Button>
				</CardContent>
			</Card>
		</section>
	);
}
