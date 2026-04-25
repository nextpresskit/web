import { useForm } from "@tanstack/react-form";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setAccessTokens } from "@/helpers/auth/auth";
import { login } from "@/services/auth/authServices";

export const Route = createFileRoute("/admin/")({
	component: AdminPage,
});

function AdminPage() {
	const [view, setView] = useState<"signin" | "forgot">("signin");
	const navigate = useNavigate();

	const handleSignIn = async (values: {
		email: string;
		password: string;
		remember: boolean;
	}) => {
		const { email, password } = values;
		const response = await login({ email, password });

		if (response.status !== 200) {
			throw new Error("Sign in failed");
		}

		setAccessTokens(
			response.data.tokens.accessToken,
			response.data.tokens.refreshToken,
		);
		await navigate({ to: "/admin/dashboard" });
	};

	const signInForm = useForm({
		defaultValues: {
			email: "",
			password: "",
			remember: false,
		},
		onSubmit: async ({ value }) => {
			await handleSignIn(value);
		},
	});

	const forgotPasswordForm = useForm({
		defaultValues: {
			email: "",
		},
		onSubmit: async ({ value }) => {
			console.log("forgot-password submit value:", value);
		},
	});

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
								We&apos;ll send a reset link if an account exists for this
								email.
							</CardDescription>
						</>
					)}
				</CardHeader>
				<CardContent>
					{view === "signin" ? (
						<form
							className="flex flex-col gap-6"
							onSubmit={(e) => {
								e.preventDefault();
								e.stopPropagation();
								signInForm.handleSubmit();
							}}
						>
							<signInForm.Field
								name="email"
								validators={{
									onChange: ({ value }: { value: string }) => {
										const trimmedValue = value.trim();
										if (trimmedValue.length === 0) return "Email is required";
										if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue)) {
											return "Enter a valid email address";
										}
										return undefined;
									},
								}}
							>
								{(field) => (
									<div className="grid gap-2">
										<Label htmlFor={field.name}>Email</Label>
										<Input
											id={field.name}
											type="email"
											name={field.name}
											autoComplete="email"
											placeholder="you@example.com"
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.setValue(e.target.value)}
											aria-invalid={field.state.meta.errors.length > 0}
										/>
										{field.state.meta.errors.length > 0 ? (
											<p className="text-sm text-destructive">
												{String(field.state.meta.errors[0])}
											</p>
										) : null}
									</div>
								)}
							</signInForm.Field>
							<signInForm.Field
								name="password"
								validators={{
									onChange: ({ value }: { value: string }) =>
										value.trim().length === 0
											? "Password is required"
											: undefined,
								}}
							>
								{(field) => (
									<div className="grid gap-2">
										<div className="flex items-center justify-between gap-2">
											<Label htmlFor={field.name}>Password</Label>
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
											id={field.name}
											type="password"
											name={field.name}
											autoComplete="current-password"
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.setValue(e.target.value)}
											aria-invalid={field.state.meta.errors.length > 0}
										/>
										{field.state.meta.errors.length > 0 ? (
											<p className="text-sm text-destructive">
												{String(field.state.meta.errors[0])}
											</p>
										) : null}
									</div>
								)}
							</signInForm.Field>
							<signInForm.Field name="remember">
								{(field) => (
									<div className="flex items-center gap-2">
										<Checkbox
											id={field.name}
											checked={field.state.value}
											onCheckedChange={(checked) =>
												field.setValue(checked === true)
											}
											onBlur={field.handleBlur}
										/>
										<Label htmlFor={field.name} className="font-normal">
											Remember me
										</Label>
									</div>
								)}
							</signInForm.Field>
							<Button type="submit" className="w-full">
								Sign in
							</Button>
						</form>
					) : (
						<form
							className="flex flex-col gap-6"
							onSubmit={(e) => {
								e.preventDefault();
								e.stopPropagation();
								forgotPasswordForm.handleSubmit();
							}}
						>
							<forgotPasswordForm.Field
								name="email"
								validators={{
									onChange: ({ value }: { value: string }) => {
										const trimmedValue = value.trim();
										if (trimmedValue.length === 0) return "Email is required";
										if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue)) {
											return "Enter a valid email address";
										}
										return undefined;
									},
								}}
							>
								{(field) => (
									<div className="grid gap-2">
										<Label htmlFor={field.name}>Email</Label>
										<Input
											id={field.name}
											type="email"
											name={field.name}
											autoComplete="email"
											placeholder="you@example.com"
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.setValue(e.target.value)}
											aria-invalid={field.state.meta.errors.length > 0}
										/>
										{field.state.meta.errors.length > 0 ? (
											<p className="text-sm text-destructive">
												{String(field.state.meta.errors[0])}
											</p>
										) : null}
									</div>
								)}
							</forgotPasswordForm.Field>
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
	);
}
