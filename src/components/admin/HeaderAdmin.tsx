import { Link, useLocation } from "@tanstack/react-router";
import { Fragment } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { buildAdminBreadcrumbs } from "@/config/adminSidebarNav";

export function HeaderAdmin() {
	const pathname = useLocation({ select: (location) => location.pathname });
	const crumbs = buildAdminBreadcrumbs(pathname);

	return (
		<header className="flex justify-between h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
			<div className="flex min-w-0 items-center gap-2 px-4">
				<SidebarTrigger className="-ml-1" />
				<Separator
					orientation="vertical"
					className="mr-2 data-[orientation=vertical]:h-4"
				/>
				<Breadcrumb>
					<BreadcrumbList>
						{crumbs.map((crumb, index) => {
							const isLast = index === crumbs.length - 1;
							return (
								<Fragment key={crumb.path}>
									{index > 0 ? (
										<BreadcrumbSeparator className="hidden md:block" />
									) : null}
									<BreadcrumbItem
										className={isLast ? undefined : "hidden md:inline-flex"}
									>
										{isLast ? (
											<BreadcrumbPage>{crumb.label}</BreadcrumbPage>
										) : crumb.href ? (
											<BreadcrumbLink asChild>
												<Link to={crumb.href}>{crumb.label}</Link>
											</BreadcrumbLink>
										) : (
											<span>{crumb.label}</span>
										)}
									</BreadcrumbItem>
								</Fragment>
							);
						})}
					</BreadcrumbList>
				</Breadcrumb>
			</div>
			<div className="flex shrink-0 items-center px-4">
				<ThemeToggle />
			</div>
		</header>
	);
}
