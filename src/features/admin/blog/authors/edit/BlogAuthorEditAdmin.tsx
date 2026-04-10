import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { fieldError } from "@/features/admin/blog/posts/edit/helpers";
import type { BlogAuthorListItem } from "@/features/admin/blog/schema";

const AUTHOR_STATUSES = ["Active", "Invited", "Suspended"] as const;

export interface BlogAuthorEditValues {
	id: string;
	displayName: string;
	email: string;
	role: string;
	avatarUrl: string;
	bio: string;
	status: string;
}

function formatDetailDate(iso: string): string {
	try {
		return new Intl.DateTimeFormat("en-US", {
			dateStyle: "medium",
			timeStyle: "short",
		}).format(new Date(iso));
	} catch {
		return iso;
	}
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidOptionalUrl(value: string): boolean {
	try {
		const u = new URL(value);
		return u.protocol === "http:" || u.protocol === "https:";
	} catch {
		return false;
	}
}

type BlogAuthorEditAdminProps = {
	author: BlogAuthorListItem;
};

export function BlogAuthorEditAdmin({ author }: BlogAuthorEditAdminProps) {
	const navigate = useNavigate();

	const authorForm = useForm({
		defaultValues: {
			id: author.id,
			displayName: author.displayName,
			email: author.email,
			role: author.role,
			avatarUrl: author.avatarUrl ?? "",
			bio: author.bio ?? "",
			status: author.status,
		} satisfies BlogAuthorEditValues,
		onSubmit: async ({ value, formApi }) => {
			console.log("BlogAuthorEditAdmin submit value:", value);
			console.log("BlogAuthorEditAdmin fieldMeta:", formApi.state.fieldMeta);
		},
	});

	const handleOnSubmit = async () => {
		let isSuccess = false;
		await authorForm.handleSubmit({
			onSuccess: () => {
				isSuccess = true;
				console.log("success");
			},
			onError: () => {
				console.log("error");
			},
		});
		return isSuccess;
	};

	const handleDeleteAuthor = () => {
		console.log("delete author");
	};

	const handleSaveAndClose = async () => {
		const isSaved = await handleOnSubmit();
		if (!isSaved) return;
		await navigate({ to: "/admin/blog/authors" });
	};

	return (
		<form className="flex min-w-0 w-full max-w-full flex-col gap-6 px-6">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
				<div className="flex flex-row flex-wrap justify-end gap-2">
					<Button
						type="button"
						variant="destructive"
						size="icon"
						onClick={handleDeleteAuthor}
						className="cursor-pointer"
						aria-label="Delete author"
					>
						<Trash2 />
					</Button>
					<Button
						type="button"
						className="cursor-pointer"
						onClick={handleOnSubmit}
					>
						Save changes
					</Button>
					<Button type="button" variant="outline" onClick={handleSaveAndClose}>
						Save and close
					</Button>
				</div>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Edit author</CardTitle>
					<CardDescription>
						Author #{author.id} · {author.postCount}{" "}
						{author.postCount === 1 ? "post" : "posts"}
					</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col gap-4">
					<authorForm.Field
						name="displayName"
						validators={{
							onChange: ({ value }: { value: string }) =>
								value.trim().length === 0
									? "Display name is required"
									: undefined,
						}}
					>
						{(field) => (
							<div className="grid gap-2">
								<Label htmlFor={field.name}>Display name</Label>
								<Input
									id={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.setValue(e.target.value)}
									aria-invalid={field.state.meta.errors.length > 0}
								/>
								{fieldError(field.state.meta.errors) ? (
									<p className="text-destructive text-sm">
										{fieldError(field.state.meta.errors)}
									</p>
								) : null}
							</div>
						)}
					</authorForm.Field>

					<authorForm.Field
						name="email"
						validators={{
							onChange: ({ value }: { value: string }) => {
								const v = value.trim();
								if (v.length === 0) return "Email is required";
								if (!EMAIL_REGEX.test(v)) return "Enter a valid email address";
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
									autoComplete="email"
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.setValue(e.target.value)}
									aria-invalid={field.state.meta.errors.length > 0}
								/>
								{fieldError(field.state.meta.errors) ? (
									<p className="text-destructive text-sm">
										{fieldError(field.state.meta.errors)}
									</p>
								) : null}
							</div>
						)}
					</authorForm.Field>

					<authorForm.Field
						name="role"
						validators={{
							onChange: ({ value }: { value: string }) =>
								value.trim().length === 0 ? "Role is required" : undefined,
						}}
					>
						{(field) => (
							<div className="grid gap-2">
								<Label htmlFor={field.name}>Role</Label>
								<Input
									id={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.setValue(e.target.value)}
									aria-invalid={field.state.meta.errors.length > 0}
								/>
								{fieldError(field.state.meta.errors) ? (
									<p className="text-destructive text-sm">
										{fieldError(field.state.meta.errors)}
									</p>
								) : null}
							</div>
						)}
					</authorForm.Field>

					<authorForm.Field
						name="avatarUrl"
						validators={{
							onChange: ({ value }: { value: string }) => {
								const v = value.trim();
								if (v.length === 0) return undefined;
								return isValidOptionalUrl(v)
									? undefined
									: "Enter a valid http(s) URL or leave empty";
							},
						}}
					>
						{(field) => (
							<div className="grid gap-2">
								<Label htmlFor={field.name}>Avatar URL</Label>
								<Input
									id={field.name}
									type="url"
									placeholder="https://…"
									className="font-mono text-sm"
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.setValue(e.target.value)}
									aria-invalid={field.state.meta.errors.length > 0}
								/>
								{fieldError(field.state.meta.errors) ? (
									<p className="text-destructive text-sm">
										{fieldError(field.state.meta.errors)}
									</p>
								) : null}
								<p className="text-muted-foreground text-xs">
									Optional image URL for the author avatar.
								</p>
							</div>
						)}
					</authorForm.Field>

					<authorForm.Field name="bio">
						{(field) => (
							<div className="grid gap-2">
								<Label htmlFor={field.name}>Bio</Label>
								<Textarea
									id={field.name}
									placeholder="Short biography shown on author pages."
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.setValue(e.target.value)}
									rows={4}
								/>
							</div>
						)}
					</authorForm.Field>

					<authorForm.Field name="status">
						{(field) => (
							<div className="grid gap-2">
								<Label htmlFor={field.name}>Status</Label>
								<Select
									value={field.state.value}
									onValueChange={(v) => field.setValue(v)}
								>
									<SelectTrigger
										id={field.name}
										className="w-full"
										onBlur={field.handleBlur}
									>
										<SelectValue placeholder="Select status" />
									</SelectTrigger>
									<SelectContent>
										{AUTHOR_STATUSES.map((s) => (
											<SelectItem key={s} value={s}>
												{s}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						)}
					</authorForm.Field>

					<div className="grid gap-1 rounded-md border bg-muted/40 px-3 py-3 text-sm text-muted-foreground">
						<p>
							<span className="font-medium text-foreground">Created: </span>
							{formatDetailDate(author.createdAt)}
						</p>
						<p>
							<span className="font-medium text-foreground">
								Last updated:{" "}
							</span>
							{formatDetailDate(author.updatedAt)}
						</p>
					</div>
				</CardContent>
			</Card>
		</form>
	);
}
