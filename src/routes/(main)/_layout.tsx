import { createFileRoute, Outlet } from "@tanstack/react-router";
import Header from "@/components/main/Header";

export const Route = createFileRoute("/(main)/_layout")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			<Header />
			<Outlet />
		</div>
	);
}
