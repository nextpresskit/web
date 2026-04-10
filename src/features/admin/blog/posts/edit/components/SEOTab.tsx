import type {
	FormAsyncValidateOrFn,
	FormValidateOrFn,
} from "@tanstack/form-core";
import type { ReactFormExtendedApi } from "@tanstack/react-form";
import { useMemo } from "react";
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
import type { BlogPosts } from "@/features/admin/blog/schema";
import type { BlogPostEditValues } from "../BlogPostEditForm";
import { fieldError } from "../helpers";

const ROBOTS_OPTIONS = [
	"index,follow",
	"index,nofollow",
	"noindex,follow",
	"noindex,nofollow",
] as const;

const OG_TYPE_OPTIONS = ["article", "website"] as const;

const TWITTER_CARD_OPTIONS = ["summary", "summary_large_image"] as const;

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

interface SEOTabProps {
	post: BlogPosts;
	postForm: BlogPostEditFormApi;
}

export const SEOTab = ({ post, postForm }: SEOTabProps) => {
	const robotsOptions = useMemo(() => {
		const set = new Set<string>(ROBOTS_OPTIONS);
		set.add(post.seo.robots);
		return Array.from(set);
	}, [post.seo.robots]);

	const ogTypeOptions = useMemo(() => {
		const set = new Set<string>(OG_TYPE_OPTIONS);
		set.add(post.seo.ogType);
		return Array.from(set);
	}, [post.seo.ogType]);

	return (
		<Card>
			<CardHeader>
				<CardTitle>SEO</CardTitle>
				<CardDescription>
					Search and social metadata for post #{post.id}.
				</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-col gap-4">
				<postForm.Field
					name="seo.title"
					validators={{
						onChange: ({ value }: { value: string }) =>
							value.trim().length === 0 ? "SEO title is required" : undefined,
					}}
				>
					{(field) => (
						<div className="grid gap-2">
							<Label htmlFor={field.name}>Meta title</Label>
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

				<postForm.Field name="seo.description">
					{(field) => (
						<div className="grid gap-2">
							<Label htmlFor={field.name}>Meta description</Label>
							<Textarea
								id={field.name}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.setValue(e.target.value)}
								placeholder="Shown in search results when set"
								rows={3}
							/>
						</div>
					)}
				</postForm.Field>

				<postForm.Field name="seo.canonicalUrl">
					{(field) => (
						<div className="grid gap-2">
							<Label htmlFor={field.name}>Canonical URL</Label>
							<Input
								id={field.name}
								type="url"
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.setValue(e.target.value)}
								placeholder="https://…"
								className="font-mono text-sm"
							/>
							<p className="text-muted-foreground text-xs">
								Leave empty to use the default URL for this post.
							</p>
						</div>
					)}
				</postForm.Field>

				<postForm.Field
					name="seo.robots"
					validators={{
						onChange: ({ value }) =>
							!robotsOptions.includes(value)
								? "Pick a valid robots directive"
								: undefined,
					}}
				>
					{(field) => (
						<div className="grid gap-2">
							<Label>Robots</Label>
							<Select
								value={field.state.value}
								onValueChange={(v) => field.setValue(v)}
							>
								<SelectTrigger
									id={field.name}
									className="w-full"
									onBlur={field.handleBlur}
								>
									<SelectValue placeholder="Robots" />
								</SelectTrigger>
								<SelectContent>
									{robotsOptions.map((r) => (
										<SelectItem key={r} value={r}>
											{r}
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
					name="seo.ogType"
					validators={{
						onChange: ({ value }) =>
							!ogTypeOptions.includes(value)
								? "Pick a valid Open Graph type"
								: undefined,
					}}
				>
					{(field) => (
						<div className="grid gap-2">
							<Label>Open Graph type</Label>
							<Select
								value={field.state.value}
								onValueChange={(v) => field.setValue(v)}
							>
								<SelectTrigger
									id={field.name}
									className="w-full"
									onBlur={field.handleBlur}
								>
									<SelectValue placeholder="og:type" />
								</SelectTrigger>
								<SelectContent>
									{ogTypeOptions.map((t) => (
										<SelectItem key={t} value={t}>
											{t}
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

				<postForm.Field name="seo.ogImage">
					{(field) => (
						<div className="grid gap-2">
							<Label htmlFor={field.name}>Open Graph image URL</Label>
							<Input
								id={field.name}
								type="url"
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.setValue(e.target.value)}
								placeholder="https://…"
								className="font-mono text-sm"
							/>
						</div>
					)}
				</postForm.Field>

				<postForm.Field
					name="seo.twitterCard"
					validators={{
						onChange: ({ value }) =>
							!(TWITTER_CARD_OPTIONS as readonly string[]).includes(value)
								? "Pick a valid Twitter card type"
								: undefined,
					}}
				>
					{(field) => (
						<div className="grid gap-2">
							<Label>Twitter card</Label>
							<Select
								value={field.state.value}
								onValueChange={(v) => field.setValue(v)}
							>
								<SelectTrigger
									id={field.name}
									className="w-full"
									onBlur={field.handleBlur}
								>
									<SelectValue placeholder="twitter:card" />
								</SelectTrigger>
								<SelectContent>
									{TWITTER_CARD_OPTIONS.map((c) => (
										<SelectItem key={c} value={c}>
											{c}
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
					name="seo.structuredDataJson"
					validators={{
						onChange: ({ value }: { value: string }) => {
							const t = value.trim();
							if (!t) return undefined;
							try {
								JSON.parse(t);
								return undefined;
							} catch {
								return "Structured data must be valid JSON";
							}
						},
					}}
				>
					{(field) => (
						<div className="grid gap-2">
							<Label htmlFor={field.name}>Structured data (JSON-LD)</Label>
							<Textarea
								id={field.name}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.setValue(e.target.value)}
								placeholder='{ "@context": "https://schema.org", … }'
								className="min-h-40 font-mono text-sm"
								spellCheck={false}
								aria-invalid={field.state.meta.errors.length > 0}
							/>
							<p className="text-muted-foreground text-xs">
								Optional JSON object for rich results. Leave empty for none.
							</p>
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
};
