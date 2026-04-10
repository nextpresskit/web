import type * as React from "react";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "@/components/ui/sidebar";
import { data as navData } from "../../../config/adminSidebarNav";
import { NavMain } from "./NavMain";
import { NavProjects } from "./NavProjects";
import { NavUser } from "./NavUser";
import { TeamSwitcher } from "./TeamSwitcher";

export function AdminSidebar({
	...props
}: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<TeamSwitcher teams={navData.teams} />
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={navData.navMain} />
				<NavProjects projects={navData.projects} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={navData.user} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
