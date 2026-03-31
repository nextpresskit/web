import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/_layout")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			Admin Layout
			<Outlet />
		</div>
	);
}
