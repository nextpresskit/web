import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(main)/_layout/about")({
	component: About,
});

function About() {
	return (
		<main className="page-wrap px-4 py-12">
			<section className="island-shell rounded-2xl p-6 sm:p-8">
				<p className="island-kicker mb-2">About</p>
			</section>
		</main>
	);
}
