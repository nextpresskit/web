import { createFileRoute, Outlet } from "@tanstack/react-router";
import { BackToTop } from "#/components/BackToTop";
import { MainFooter } from "#/components/main/MainFooter";
import { MainHeader } from "#/components/main/MainHeader";

export const Route = createFileRoute("/(main)/_layout")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			<MainHeader />
			<Outlet />
			<MainFooter />
			<BackToTop />
		</div>
	);
}
