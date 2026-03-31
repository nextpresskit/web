import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/_layout/dashboard")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/(admin)/_layout/dashboard"!</div>;
}
