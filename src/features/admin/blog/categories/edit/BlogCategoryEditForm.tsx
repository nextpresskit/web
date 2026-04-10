import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { useRef } from "react";
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
import type { BlogCategoryListItem } from "@/features/admin/blog/schema";
import { fieldError, titleToSlug } from "@/features/admin/blog/edit/helpers";

const PARENT_NONE = "__none__";

export interface BlogCategoryEditValues {
	id: number;
	name: string;
	slug: string;
	description: string;
	parentName: string | null;
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

type BlogCategoryEditFormProps = {
	category: BlogCategoryListItem;
	allCategories: BlogCategoryListItem[];
};

export function BlogCategoryEditForm({
	category,
	allCategories,
}: BlogCategoryEditFormProps) {
	const navigate = useNavigate();
	const slugTracksNameRef = useRef(true);

	const parentOptions = allCategories
		.filter((c) => c.id !== category.id)
		.map((c) => c.name)
		.sort((a, b) => a.localeCompare(b));

	const categoryForm = useForm({
		defaultValues: {
			id: category.id,
			name: category.name,
			slug: category.slug,
			description: category.description ?? "",
			parentName: category.parentName,
		} satisfies BlogCategoryEditValues,
		onSubmit: async ({ value, formApi }) => {
			console.log("BlogCategoryEditForm submit value:", value);
			console.log("BlogCategoryEditForm fieldMeta:", formApi.state.fieldMeta);
		},
	});

	const handleOnSubmit = async () => {
		let isSuccess = false;
		await categoryForm.handleSubmit({
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

	const handleDeleteCategory = () => {
		console.log("delete category");
	};

	const handleSaveAndClose = async () => {
		const isSaved = await handleOnSubmit();
		if (!isSaved) return;
		await navigate({ to: "/admin/blog/categories" });
	};

	return (
		<form className="flex min-w-0 w-full max-w-full flex-col gap-6 px-6">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
				<div className="flex flex-row flex-wrap justify-end gap-2">
					<Button
						type="button"
						variant="destructive"
						size="icon"
						onClick={handleDeleteCategory}
						className="cursor-pointer"
						aria-label="Delete category"
					>
						<Trash2 />
					</Button>
					<Button type="button" className="cursor-pointer" onClick={handleOnSubmit}>
						Save changes
					</Button>
					<Button type="button" variant="outline" onClick={handleSaveAndClose}>
						Save and close
					</Button>
				</div>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Edit category</CardTitle>
					<CardDescription>
						Category #{category.id} · {category.postCount} posts
					</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col gap-4">
					<categoryForm.Field
						name="name"
						listeners={{
							onChange: ({ value }) => {
								if (slugTracksNameRef.current) {
									categoryForm.setFieldValue("slug", titleToSlug(value));
								}
							},
						}}
						validators={{
							onChange: ({ value }: { value: string }) =>
								value.trim().length === 0 ? "Name is required" : undefined,
						}}
					>
						{(field) => (
							<div className="grid gap-2">
								<Label htmlFor={field.name}>Name</Label>
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
					</categoryForm.Field>

					<categoryForm.Field
						name="slug"
						validators={{
							onChange: ({ value }: { value: string }) => {
								const v = value.trim();
								if (v.length === 0) return "Slug is required";
								if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v)) {
									return "Use lowercase letters, numbers, and single hyphens";
								}
								return undefined;
							},
						}}
					>
						{(field) => (
							<div className="grid gap-2">
								<Label htmlFor={field.name}>Slug</Label>
								<Input
									id={field.name}
									className="font-mono text-sm"
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => {
										slugTracksNameRef.current = false;
										field.setValue(e.target.value);
									}}
									aria-invalid={field.state.meta.errors.length > 0}
								/>
								{fieldError(field.state.meta.errors) ? (
									<p className="text-destructive text-sm">
										{fieldError(field.state.meta.errors)}
									</p>
								) : null}
								<p className="text-muted-foreground text-xs">
									Auto-generated from the name until you edit this field.
								</p>
							</div>
						)}
					</categoryForm.Field>

					<categoryForm.Field name="description">
						{(field) => (
							<div className="grid gap-2">
								<Label htmlFor={field.name}>Description</Label>
								<Textarea
									id={field.name}
									placeholder="Optional description for archive pages and SEO."
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.setValue(e.target.value)}
									rows={4}
								/>
							</div>
						)}
					</categoryForm.Field>

					<categoryForm.Field name="parentName">
						{(field) => (
							<div className="grid gap-2">
								<Label htmlFor={field.name}>Parent category</Label>
								<Select
									value={field.state.value ?? PARENT_NONE}
									onValueChange={(v) =>
										field.setValue(v === PARENT_NONE ? null : v)
									}
								>
									<SelectTrigger
										id={field.name}
										className="w-full"
										onBlur={field.handleBlur}
									>
										<SelectValue placeholder="None" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value={PARENT_NONE}>None</SelectItem>
										{parentOptions.map((name) => (
											<SelectItem key={name} value={name}>
												{name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						)}
					</categoryForm.Field>

					<div className="grid gap-1 rounded-md border bg-muted/40 px-3 py-3 text-sm text-muted-foreground">
						<p>
							<span className="font-medium text-foreground">Created: </span>
							{formatDetailDate(category.createdAt)}
						</p>
						<p>
							<span className="font-medium text-foreground">Last updated: </span>
							{formatDetailDate(category.updatedAt)}
						</p>
					</div>
				</CardContent>
			</Card>
		</form>
	);
}
