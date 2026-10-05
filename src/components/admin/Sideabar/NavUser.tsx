import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { ChevronsUpDown, LogIn, LogOut, UserRound } from "lucide-react";
import type { User } from "#/@types/user";
import { Avatar, AvatarFallback, AvatarImage } from "#/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "#/components/ui/sidebar";
import {
	currentUserQueryKey,
	currentUserQueryOptions,
	logout,
} from "#/services/auth/authServices";

function displayName(user: User) {
	const name = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
	return name || user.email;
}

function initials(user: User) {
	const parts = [user.firstName, user.lastName].filter(Boolean);
	const source = parts.length > 0 ? parts : [user.email];
	return source
		.map((part) => part.trim()[0] ?? "")
		.join("")
		.slice(0, 2)
		.toUpperCase();
}

function UserIdentity({ user }: { user: User | null }) {
	return (
		<>
			<Avatar className="h-8 w-8 rounded-lg">
				{user?.avatarUrl ? <AvatarImage src={user.avatarUrl} alt="" /> : null}
				<AvatarFallback className="rounded-lg">
					{user ? initials(user) : <UserRound className="size-4" aria-hidden />}
				</AvatarFallback>
			</Avatar>
			<div className="grid flex-1 text-left text-sm leading-tight">
				<span className="truncate font-medium">
					{user ? displayName(user) : "Not signed in"}
				</span>
				<span className="truncate text-xs text-muted-foreground">
					{user ? user.email : "Sign in to manage content"}
				</span>
			</div>
		</>
	);
}

export function NavUser() {
	const { isMobile } = useSidebar();
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const { data: user = null } = useQuery(currentUserQueryOptions);

	const handleLogout = async () => {
		try {
			await logout();
		} finally {
			queryClient.setQueryData(currentUserQueryKey, null);
			await navigate({ to: "/admin" });
		}
	};

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<UserIdentity user={user} />
							<ChevronsUpDown className="ml-auto size-4" aria-hidden />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
						side={isMobile ? "bottom" : "right"}
						align="end"
						sideOffset={4}
					>
						<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
								<UserIdentity user={user} />
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						{user ? (
							<DropdownMenuItem onSelect={() => void handleLogout()}>
								<LogOut />
								Log out
							</DropdownMenuItem>
						) : (
							<DropdownMenuItem asChild>
								<Link to="/admin">
									<LogIn />
									Sign in
								</Link>
							</DropdownMenuItem>
						)}
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
