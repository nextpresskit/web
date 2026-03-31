import { createFileRoute } from "@tanstack/react-router";

import { Button } from "#/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";
import { Checkbox } from "#/components/ui/checkbox";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";

export const Route = createFileRoute("/(admin)/admin")({
	component: AdminPage,
});

function AdminPage() {
	return (
		<div className="flex min-h-[50vh] flex-col items-center justify-center px-4 py-10">
			<Card className="w-full max-w-sm">
				<CardHeader>
					<CardTitle className="text-xl">Sign in</CardTitle>
					<CardDescription>
						Enter your credentials to access the admin area.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form
						className="flex flex-col gap-6"
						onSubmit={(e) => {
							e.preventDefault();
						}}
					>
						<div className="grid gap-2">
							<Label htmlFor="admin-email">Email</Label>
							<Input
								id="admin-email"
								type="email"
								name="email"
								autoComplete="email"
								placeholder="you@example.com"
							/>
						</div>
						<div className="grid gap-2">
							<div className="flex items-center justify-between gap-2">
								<Label htmlFor="admin-password">Password</Label>
								<Button
									type="button"
									variant="link"
									size="sm"
									className="h-auto px-0 py-0 text-xs"
								>
									Forgot password?
								</Button>
							</div>
							<Input
								id="admin-password"
								type="password"
								name="password"
								autoComplete="current-password"
							/>
						</div>
						<div className="flex items-center gap-2">
							<Checkbox id="admin-remember" />
							<Label htmlFor="admin-remember" className="font-normal">
								Remember me
							</Label>
						</div>
						<Button type="submit" className="w-full">
							Sign in
						</Button>
					</form>
				</CardContent>
				<CardFooter className="flex justify-center border-t pt-6">
					<p className="text-center text-sm text-muted-foreground">
						Need an account?{" "}
						<Button type="button" variant="link" className="h-auto p-0 text-sm">
							Contact an administrator
						</Button>
					</p>
				</CardFooter>
			</Card>
		</div>
	);
}
