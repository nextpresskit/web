import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(main)/_layout/")({ component: App });

function App() {
	return <main className="container mx-auto">Some</main>;
}
