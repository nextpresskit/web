import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/(main)/_layout")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="p-2">
			<div className="border-b">Main Layout</div>
			<div>
				<Outlet />
			</div>
		</div>
	)
}
