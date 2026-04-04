import { createFileRoute, Outlet } from "@tanstack/react-router";
import { HeaderAdmin } from "#/components/admin/HeaderAdmin";
import { NotFoundAdmin } from "#/components/admin/NotFoundAdmin";
import { AdminSidebar } from "#/components/admin/Sideabar/AdminSidebar";
import { SidebarInset, SidebarProvider } from "#/components/ui/sidebar";
import { Toaster } from "#/components/ui/sonner";

export const Route = createFileRoute("/admin/_layout")({
	component: RouteComponent,
	notFoundComponent: () => <NotFoundAdmin />,
});

function RouteComponent() {
	return (
		<SidebarProvider
			style={
				{
					"--sidebar-width": "calc(var(--spacing) * 72)",
					"--header-height": "calc(var(--spacing) * 12)",
				} as React.CSSProperties
			}
		>
			<AdminSidebar />
			<SidebarInset>
				<HeaderAdmin />
				<div className="flex min-h-screen w-full bg-background pt-6">
					<div className="flex min-w-0 flex-1 flex-col">
						<Outlet />
						<Toaster />
					</div>
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
