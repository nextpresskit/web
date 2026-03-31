import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(main)/_layout/contacts")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/(main)/_layout/contacts"!</div>;
}
