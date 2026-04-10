import type {
	FormAsyncValidateOrFn,
	FormValidateOrFn,
} from "@tanstack/form-core";
import type { ReactFormExtendedApi } from "@tanstack/react-form";
import { XIcon } from "lucide-react";
import { useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
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
import { BLOG_POST_STATUSES } from "@/features/admin/blog/posts/list/Columns";
import type { BlogPosts } from "@/features/admin/blog/schema";
import type { BlogPostEditValues } from "../BlogPostEditForm";
import { fieldError, titleToSlug } from "../helpers";

type BlogPostEditFormApi = ReactFormExtendedApi<
	BlogPostEditValues,
	FormValidateOrFn<BlogPostEditValues> | undefined,
	FormValidateOrFn<BlogPostEditValues> | undefined,
	FormAsyncValidateOrFn<BlogPostEditValues> | undefined,
	FormValidateOrFn<BlogPostEditValues> | undefined,
	FormAsyncValidateOrFn<BlogPostEditValues> | undefined,
	FormValidateOrFn<BlogPostEditValues> | undefined,
	FormAsyncValidateOrFn<BlogPostEditValues> | undefined,
	FormValidateOrFn<BlogPostEditValues> | undefined,
	FormAsyncValidateOrFn<BlogPostEditValues> | undefined,
	FormAsyncValidateOrFn<BlogPostEditValues> | undefined,
	unknown
>;

interface GeneralTabProps {
	post: BlogPosts;
	postForm: BlogPostEditFormApi;
}

export const GeneralTab = ({ post, postForm }: GeneralTabProps) => {
	const slugTracksTitleRef = useRef(true);
	const [tagDraft, setTagDraft] = useState("");

	return (
		<Card>
			<CardHeader>
				<CardTitle>Edit post</CardTitle>
				<CardDescription>
					Post #{post.id} · {post.uuid}
				</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-col gap-4">
				<postForm.Field
					name="title"
					listeners={{
						onChange: ({ value }) => {
							if (slugTracksTitleRef.current) {
								postForm.setFieldValue("slug", titleToSlug(value));
							}
						},
					}}
					validators={{
						onChange: ({ value }: { value: string }) =>
							value.trim().length === 0 ? "Title is required" : undefined,
					}}
				>
					{(field) => (
						<div className="grid gap-2">
							<Label>Title</Label>
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
				</postForm.Field>

				<postForm.Field
					name="status"
					validators={{
						onChange: ({ value }) =>
							!(BLOG_POST_STATUSES as readonly string[]).includes(value)
								? "Pick a valid status"
								: undefined,
					}}
				>
					{(field) => (
						<div className="grid gap-2">
							<Label>Status</Label>
							<Select
								value={field.state.value}
								onValueChange={(v) => field.setValue(v)}
							>
								<SelectTrigger
									id={field.name}
									className="w-full"
									onBlur={field.handleBlur}
								>
									<SelectValue placeholder="Status" />
								</SelectTrigger>
								<SelectContent>
									{BLOG_POST_STATUSES.map((s) => (
										<SelectItem key={s} value={s}>
											{s}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{fieldError(field.state.meta.errors) ? (
								<p className="text-destructive text-sm">
									{fieldError(field.state.meta.errors)}
								</p>
							) : null}
						</div>
					)}
				</postForm.Field>

				<postForm.Field
					name="slug"
					validators={{
						onChange: ({ value }) =>
							value.trim().length === 0 ? "Slug is required" : undefined,
					}}
				>
					{(field) => (
						<div className="grid gap-2">
							<Label>Slug</Label>
							<Input
								id={field.name}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => {
									slugTracksTitleRef.current = false;
									field.setValue(e.target.value);
								}}
								aria-invalid={field.state.meta.errors.length > 0}
								className="font-mono text-sm"
							/>
							<p className="text-muted-foreground text-xs">
								Auto-generated from the title until you edit this field.
							</p>
							{fieldError(field.state.meta.errors) ? (
								<p className="text-destructive text-sm">
									{fieldError(field.state.meta.errors)}
								</p>
							) : null}
						</div>
					)}
				</postForm.Field>

				<postForm.Field name="tags">
					{(field) => (
						<div className="grid gap-2">
							<Label htmlFor={field.name}>Tags</Label>

							<div className="border-input focus-within:ring-ring/50 focus-within:border-ring rounded-md border px-3 py-2 focus-within:ring-[3px]">
								<div className="mb-2 flex flex-wrap gap-2">
									{field.state.value.map((tag) => (
										<Badge key={tag} variant="secondary" className="gap-1 pr-1">
											<span>{tag}</span>
											<button
												type="button"
												onClick={() =>
													field.setValue(
														field.state.value.filter((t) => t !== tag),
													)
												}
												className="hover:bg-muted rounded-full p-0.5"
												aria-label={`Remove ${tag}`}
											>
												<XIcon className="size-3" />
											</button>
										</Badge>
									))}
								</div>
								<Input
									id={field.name}
									value={tagDraft}
									onBlur={field.handleBlur}
									onChange={(e) => setTagDraft(e.target.value)}
									onKeyDown={(e) => {
										if (e.key === "Enter" || e.key === ",") {
											e.preventDefault();
											const nextTag = tagDraft.trim().replaceAll(",", "");
											if (!nextTag) return;
											if (field.state.value.includes(nextTag)) {
												setTagDraft("");
												return;
											}
											field.setValue([...field.state.value, nextTag]);
											setTagDraft("");
										}

										if (
											e.key === "Backspace" &&
											tagDraft.length === 0 &&
											field.state.value.length > 0
										) {
											field.setValue(field.state.value.slice(0, -1));
										}
									}}
									placeholder="Type a tag and press Enter"
									className="border-0 px-0 font-mono text-sm shadow-none focus-visible:ring-0"
								/>
							</div>
							<p className="text-muted-foreground text-xs">
								Press Enter or comma to add a tag.
							</p>
						</div>
					)}
				</postForm.Field>
			</CardContent>
		</Card>
	);
};
