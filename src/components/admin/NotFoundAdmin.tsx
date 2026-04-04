import { Link } from "@tanstack/react-router";

import { Button } from "#/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";

export const NotFoundAdmin = () => {
	return (
		<div className="flex flex-1 flex-col items-center justify-center px-4 py-12 md:px-8">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle>Page not found</CardTitle>
					<CardDescription>
						This admin page does not exist, or the link may be outdated.
					</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
					<Button asChild>
						<Link to="/admin/dashboard">Back to dashboard</Link>
					</Button>
					<Button variant="outline" asChild>
						<Link to="/">View storefront</Link>
					</Button>
				</CardContent>
			</Card>
		</div>
	);
};
