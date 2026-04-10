import { useForm } from "@tanstack/react-form";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { BlogPosts } from "@/features/admin/blog/schema";
import { GeneralTab } from "./components/GeneralTab";
import { BlogPostMarkdownEditor } from "./components/MarkDownEditor";
import { PostButtons } from "./components/PostButtons";
import { SEOTab } from "./components/SEOTab";
import { fieldError } from "./helpers";

export interface BlogPostSeoEditValues {
	title: string;
	description: string;
	canonicalUrl: string;
	robots: string;
	ogType: string;
	ogImage: string;
	twitterCard: string;
	structuredDataJson: string;
}

export interface BlogPostEditValues {
	id: number;
	title: string;
	status: string;
	slug: string;
	tags: string[];
	bodyMarkdown: string;
	seo: BlogPostSeoEditValues;
}

type BlogPostEditFormProps = {
	post: BlogPosts;
};

export function BlogPostEditForm({ post }: BlogPostEditFormProps) {
	const handleDeletePost = () => {
		console.log("delete post");
	};

	const postForm = useForm({
		defaultValues: {
			id: post.id,
			title: post.title,
			status: post.status,
			slug: post.slug,
			tags: post.tags.map((t) => t.name),
			bodyMarkdown: post.bodyMarkdownPreview,
			seo: {
				title: post.seo.title,
				description: post.seo.description ?? "",
				canonicalUrl: post.seo.canonicalUrl ?? "",
				robots: post.seo.robots,
				ogType: post.seo.ogType,
				ogImage: post.seo.ogImage ?? "",
				twitterCard: post.seo.twitterCard,
				structuredDataJson: post.seo.structuredData
					? JSON.stringify(post.seo.structuredData, null, 2)
					: "",
			},
		} satisfies BlogPostEditValues,
		onSubmit: async ({ value, formApi }) => {
			console.log("🚀 ~ BlogPostEditForm ~ formApi:", formApi);
			const { fieldMeta } = formApi.state;
			console.log("BlogPostEditForm submit value:", value);
			console.log("BlogPostEditForm fields state (fieldMeta):", fieldMeta);
		},
	});

	const handleOnSubmit = async () => {
		let isSuccess = false;
		await postForm.handleSubmit({
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

	return (
		<Tabs defaultValue="general" className="w-full">
			<form className="flex flex-col gap-6">
				<div className="flex flex-col md:flex-row justify-between items-center px-6">
					<TabsList>
						<TabsTrigger value="general">General</TabsTrigger>
						<TabsTrigger value="content">Content</TabsTrigger>
						<TabsTrigger value="seo">SEO</TabsTrigger>
						<TabsTrigger value="social">Social</TabsTrigger>
					</TabsList>
					<div className="flex flex-row gap-2">
						<PostButtons
							handleDeletePost={handleDeletePost}
							handleOnSubmit={handleOnSubmit}
						/>
					</div>
				</div>
				<TabsContent value="general">
					<div className="flex min-w-0 w-full max-w-full flex-col gap-6 px-6">
						<GeneralTab post={post} postForm={postForm} />
					</div>
				</TabsContent>
				<TabsContent value="content">
					<div className="flex min-w-0 w-full max-w-full flex-col gap-6 px-6">
						<Card>
							<CardHeader>
								<CardTitle>Content</CardTitle>
								<CardDescription>
									Add your blog post content here.
								</CardDescription>
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
					</div>
				</TabsContent>
				<TabsContent value="seo">
					<div className="flex min-w-0 w-full max-w-full flex-col gap-6 px-6">
						<SEOTab post={post} postForm={postForm} />
					</div>
				</TabsContent>
				<TabsContent value="social">
					<Card>
						<CardHeader>
							<CardTitle>Social</CardTitle>
							<CardDescription>
								Manage your account preferences and options. Customize your
								experience to fit your needs.
							</CardDescription>
						</CardHeader>
						<CardContent className="text-sm text-muted-foreground">
							Configure notifications, security, and themes.
						</CardContent>
					</Card>
				</TabsContent>
			</form>
		</Tabs>
	);
}
