import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

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

export const Route = createFileRoute("/admin/")({
	component: AdminPage,
});

function AdminPage() {
	const [view, setView] = useState<"signin" | "forgot">("signin");

	return (
		<div className="flex min-h-[50vh] flex-col items-center justify-center px-4 py-10">
			<Card className="w-full max-w-sm">
				<CardHeader>
					{view === "signin" ? (
						<>
							<CardTitle className="text-xl">Sign in</CardTitle>
							<CardDescription>
								Enter your credentials to access the admin area.
							</CardDescription>
						</>
					) : (
						<>
							<CardTitle className="text-xl">Forgot password</CardTitle>
							<CardDescription>
								We&apos;ll send a reset link if an account exists for this email.
							</CardDescription>
						</>
					)}
				</CardHeader>
				<CardContent>
					{view === "signin" ? (
						<form
							className="flex flex-col gap-6"
							onSubmit={(e) => {
								e.preventDefault()
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
										onClick={() => setView("forgot")}
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
					) : (
						<form
							className="flex flex-col gap-6"
							onSubmit={(e) => {
								e.preventDefault()
							}}
						>
							<div className="grid gap-2">
								<Label htmlFor="admin-reset-email">Email</Label>
								<Input
									id="admin-reset-email"
									type="email"
									name="email"
									autoComplete="email"
									placeholder="you@example.com"
								/>
							</div>
							<Button type="submit" className="w-full">
								Send reset link
							</Button>
							<Button
								type="button"
								variant="ghost"
								className="w-full"
								onClick={() => setView("signin")}
							>
								Back to sign in
							</Button>
						</form>
					)}
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
	)
}
