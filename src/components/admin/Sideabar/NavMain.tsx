import { Link, useLocation } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import type { AdminNavItem } from "@/config/adminSidebarNav";

function isActivePath(pathname: string, url: string) {
	return pathname === url || pathname.startsWith(`${url}/`);
}

export function NavMain({ items }: { items: AdminNavItem[] }) {
	const pathname = useLocation({ select: (location) => location.pathname });

	return (
		<SidebarGroup>
			<SidebarGroupLabel>Manage</SidebarGroupLabel>
			<SidebarMenu>
				{items.map((item) => {
					const subItems = item.items ?? [];

					if (subItems.length === 0) {
						const active = isActivePath(pathname, item.url);
						return (
							<SidebarMenuItem key={item.title}>
								<SidebarMenuButton
									asChild
									tooltip={item.title}
									isActive={active}
								>
									<Link
										to={item.url}
										aria-current={active ? "page" : undefined}
									>
										<item.icon />
										<span>{item.title}</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						);
					}

					const groupActive = subItems.some((sub) =>
						isActivePath(pathname, sub.url),
					);

					return (
						<Collapsible
							key={item.title}
							asChild
							defaultOpen={groupActive}
							className="group/collapsible"
						>
							<SidebarMenuItem>
								<CollapsibleTrigger asChild>
									<SidebarMenuButton
										tooltip={item.title}
										isActive={groupActive}
									>
										<item.icon />
										<span>{item.title}</span>
										<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
									</SidebarMenuButton>
								</CollapsibleTrigger>
								<CollapsibleContent>
									<SidebarMenuSub>
										{subItems.map((subItem) => {
											const active = isActivePath(pathname, subItem.url);
											return (
												<SidebarMenuSubItem key={subItem.title}>
													<SidebarMenuSubButton asChild isActive={active}>
														<Link
															to={subItem.url}
															aria-current={active ? "page" : undefined}
														>
															<span>{subItem.title}</span>
														</Link>
													</SidebarMenuSubButton>
												</SidebarMenuSubItem>
											);
										})}
									</SidebarMenuSub>
								</CollapsibleContent>
							</SidebarMenuItem>
						</Collapsible>
					);
				})}
			</SidebarMenu>
		</SidebarGroup>
	);
}
