import { createFileRoute } from "@tanstack/react-router";
import { DataTableAdmin } from "#/components/admin/DataTableAdmin";

export const Route = createFileRoute("/admin/_layout/blog/posts")({
	component: RouteComponent,
});

const initalData = await import("#/dummy_data/admin_data_table.json").then(
	async (module) => module.default,
);
function RouteComponent() {
	return <DataTableAdmin data={initalData} />;
}
