import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import type { AdminPost } from "#/@types/admin";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#/components/ui/tabs";
import { getApiErrorMessage } from "#/lib/axios/clientAxios";
import {
	adminPostsQueryKey,
	deleteAdminPost,
	updateAdminPost,
} from "#/services/admin/posts/postsServices";
import { ContentTab } from "./components/ContentTab";
import { GeneralTab } from "./components/GeneralTab";
import { PostButtons } from "./components/PostButtons";
import { SEOTab } from "./components/SEOTab";

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
	post: AdminPost;
};

export function BlogPostEditForm({ post }: BlogPostEditFormProps) {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const saveMutation = useMutation({
		mutationFn: (value: BlogPostEditValues) => {
			let structuredData: Record<string, unknown> | null = null;
			const raw = value.seo.structuredDataJson.trim();
			if (raw) {
				const parsed: unknown = JSON.parse(raw);
				if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
					structuredData = parsed as Record<string, unknown>;
				}
			}
			return updateAdminPost(post.id, {
				title: value.title.trim(),
				slug: value.slug.trim(),
				status: value.status,
				content: value.bodyMarkdown,
				seo: {
					title: value.seo.title,
					description: value.seo.description,
					canonicalUrl: value.seo.canonicalUrl,
					robots: value.seo.robots,
					ogType: value.seo.ogType,
					ogImage: value.seo.ogImage,
					twitterCard: value.seo.twitterCard,
					structuredData,
				},
			});
		},
		onSuccess: (saved) => {
			queryClient.setQueryData(
				[...adminPostsQueryKey, "detail", String(post.id)],
				saved,
			);
			void queryClient.invalidateQueries({
				queryKey: [...adminPostsQueryKey, "list"],
			});
			toast.success("Post saved");
		},
		onError: (error) => {
			toast.error(
				error instanceof SyntaxError
					? "Structured data is not valid JSON."
					: getApiErrorMessage(error),
			);
		},
	});

	const deleteMutation = useMutation({
		mutationFn: () => deleteAdminPost(post.id),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: adminPostsQueryKey });
			toast.success("Post deleted");
			await navigate({ to: "/admin/blog/posts" });
		},
		onError: (error) => toast.error(getApiErrorMessage(error)),
	});

	const handleDeletePost = () => {
		if (
			typeof window !== "undefined" &&
			window.confirm(`Delete "${post.title}"? This cannot be undone.`)
		) {
			deleteMutation.mutate();
		}
	};

	const postForm = useForm({
		defaultValues: {
			id: post.id,
			title: post.title,
			status: post.status,
			slug: post.slug,
			tags: post.tags.map((t) => t.name),
			bodyMarkdown: post.content,
			seo: {
				title: post.seo.title,
				description: post.seo.description,
				canonicalUrl: post.seo.canonicalUrl,
				robots: post.seo.robots,
				ogType: post.seo.ogType,
				ogImage: post.seo.ogImage,
				twitterCard: post.seo.twitterCard,
				structuredDataJson: post.seo.structuredData
					? JSON.stringify(post.seo.structuredData, null, 2)
					: "",
			},
		} satisfies BlogPostEditValues,
		onSubmit: async ({ value }) => {
			await saveMutation.mutateAsync(value);
		},
	});

	const handleOnSubmit = async () => {
		await postForm.handleSubmit();
		return postForm.state.isSubmitSuccessful;
	};

	return (
		<Tabs defaultValue="general" className="w-full">
			<form className="flex flex-col gap-6">
				<div className="flex flex-col md:flex-row justify-between items-center px-6">
					<TabsList>
						<TabsTrigger value="general">General</TabsTrigger>
						<TabsTrigger value="content">Content</TabsTrigger>
						<TabsTrigger value="seo">SEO</TabsTrigger>
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
						<ContentTab postForm={postForm} />
					</div>
				</TabsContent>
				<TabsContent value="seo">
					<div className="flex min-w-0 w-full max-w-full flex-col gap-6 px-6">
						<SEOTab post={post} postForm={postForm} />
					</div>
				</TabsContent>
			</form>
		</Tabs>
	);
}
