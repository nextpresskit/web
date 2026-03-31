import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "#/components/ui/button";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/(main)/_layout/")({ component: App });

function App() {
	return (
		<main className="page-wrap px-4 pb-8 pt-14">
			<Toaster />
			<Button onClick={() => toast.success("Hello World")}>Show toast</Button>
		</main>
	);
}
