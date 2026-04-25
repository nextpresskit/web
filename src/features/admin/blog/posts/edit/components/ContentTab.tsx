import type {
	FormAsyncValidateOrFn,
	FormValidateOrFn,
	ReactFormExtendedApi,
} from "@tanstack/react-form";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { BlogPostEditValues } from "../BlogPostEditForm";
import { fieldError } from "../helpers";
import { BlogPostMarkdownEditor } from "./MarkDownEditor";

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
interface ContentTabProps {
	postForm: BlogPostEditFormApi;
}

export function ContentTab({ postForm }: ContentTabProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Content</CardTitle>
				<CardDescription>Add your blog post content here.</CardDescription>
			</CardHeader>
			<CardContent className="text-sm text-muted-foreground">
				<postForm.Field
					name="bodyMarkdown"
					validators={{
						onChange: ({ value }: { value: string }) =>
							value.trim().length === 0
								? "Body markdown is required"
								: undefined,
					}}
				>
					{(field) => (
						<div className="grid gap-2">
							<BlogPostMarkdownEditor
								id={field.name}
								label="Body (markdown)"
								value={field.state.value}
								onChange={(v) => field.setValue(v)}
							/>
							{fieldError(field.state.meta.errors) ? (
								<p className="text-destructive text-sm">
									{fieldError(field.state.meta.errors)}
								</p>
							) : null}
						</div>
					)}
				</postForm.Field>
			</CardContent>
		</Card>
	);
}
