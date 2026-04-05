import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/_layout/blog/$postId")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/admin/_layout/blog/posts/$postId"!</div>;
}
