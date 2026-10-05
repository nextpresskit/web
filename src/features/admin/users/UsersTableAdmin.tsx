import type { AdminUser } from "#/@types/admin";
import { formatAdminDate } from "#/components/admin/ListControls";
import { Avatar, AvatarFallback } from "#/components/ui/avatar";
import { Badge } from "#/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "#/components/ui/table";

function RoleBadges({ roles }: { roles: string[] }) {
	if (roles.length === 0) {
		return <span className="text-muted-foreground">No role</span>;
	}
	return (
		<div className="flex flex-wrap gap-1">
			{roles.map((role) => (
				<Badge
					key={role}
					variant={
						role === "superadmin" || role === "admin" ? "default" : "outline"
					}
				>
					{role}
				</Badge>
			))}
		</div>
	);
}

/** One server page of users. */
export function UsersTableAdmin({ users }: { users: AdminUser[] }) {
	return (
		<div className="min-w-0 overflow-x-auto border-y">
			<Table className="min-w-max">
				<TableHeader className="bg-muted">
					<TableRow>
						<TableHead className="pl-4 lg:pl-6">User</TableHead>
						<TableHead>Roles</TableHead>
						<TableHead>Status</TableHead>
						<TableHead className="hidden md:table-cell">Joined</TableHead>
						<TableHead className="hidden pr-4 text-right md:table-cell lg:pr-6">
							Id
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{users.length ? (
						users.map((user) => (
							<TableRow key={user.uuid}>
								<TableCell className="pl-4 lg:pl-6">
									<div className="flex items-center gap-3">
										<Avatar className="size-8 rounded-lg">
											<AvatarFallback className="rounded-lg text-xs">
												{user.initials}
											</AvatarFallback>
										</Avatar>
										<div className="min-w-0">
											<div className="truncate font-medium">
												{user.fullName}
											</div>
											<div className="truncate text-muted-foreground text-xs">
												{user.email}
											</div>
										</div>
									</div>
								</TableCell>
								<TableCell>
									<RoleBadges roles={user.roles} />
								</TableCell>
								<TableCell>
									<Badge variant={user.active ? "secondary" : "outline"}>
										{user.active ? "Active" : "Inactive"}
									</Badge>
								</TableCell>
								<TableCell className="hidden whitespace-nowrap text-muted-foreground tabular-nums md:table-cell">
									{formatAdminDate(user.createdAt)}
								</TableCell>
								<TableCell className="hidden pr-4 text-right text-muted-foreground tabular-nums md:table-cell lg:pr-6">
									{user.id}
								</TableCell>
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell
								colSpan={5}
								className="h-24 text-center text-muted-foreground"
							>
								No users match this search.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
}
