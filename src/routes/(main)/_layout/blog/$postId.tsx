import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
	ArrowLeftIcon,
	CalendarIcon,
	ClockIcon,
	Link2Icon,
	Share2Icon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Avatar, AvatarFallback } from "#/components/ui/avatar";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";
import { Separator } from "#/components/ui/separator";
import articlesFile from "#/dummy_data/articles.json";

const ALL_ARTICLES = articlesFile.articles;
type Article = (typeof articlesFile.articles)[number];

function findArticle(postId: string): Article | undefined {
	return ALL_ARTICLES.find((a) => a.slug === postId || a.id === postId);
}

function authorInitials(name: string): string {
	return name
		.split(" ")
		.map((part) => part[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();
}

function formatDate(iso: string): string {
	return new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	}).format(new Date(iso));
}

function ArticleBody({ blocks }: { blocks: Article["body"] }) {
	return (
		<div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:scroll-mt-24 prose-blockquote:border-l-primary prose-a:text-primary">
			{blocks.map((block, index) => {
				const key = `${block.type}-${index}`;
				switch (block.type) {
					case "paragraph":
						return (
							<p key={key} className="leading-relaxed">
								{block.text}
							</p>
						);
					case "heading": {
						const Level = block.level === 3 ? "h3" : "h2";
						return (
							<Level key={key} className="font-semibold tracking-tight">
								{block.text}
							</Level>
						);
					}
					case "blockquote":
						return (
							<blockquote key={key} className="not-italic">
								{block.text}
							</blockquote>
						);
					case "list": {
						const items = block.items ?? [];
						if (block.ordered) {
							return (
								<ol key={key}>
									{items.map((item) => (
										<li key={`${key}-${item}`}>{item}</li>
									))}
								</ol>
							);
						}
						return (
							<ul key={key}>
								{items.map((item) => (
									<li key={`${key}-${item}`}>{item}</li>
								))}
							</ul>
						);
					}
					default:
						return null;
				}
			})}
		</div>
	);
}

function AuthorCard({ article }: { article: Article }) {
	return (
		<Card>
			<CardHeader className="pb-3">
				<div className="flex gap-3">
					<Avatar size="sm">
						<AvatarFallback>{authorInitials(article.author)}</AvatarFallback>
					</Avatar>
					<div className="min-w-0 space-y-0.5">
						<CardTitle className="text-base leading-tight">
							{article.author}
						</CardTitle>
						<CardDescription>{article.authorRole}</CardDescription>
					</div>
				</div>
			</CardHeader>
			<CardContent className="space-y-3 text-muted-foreground text-sm leading-relaxed">
				<p>{article.authorBio}</p>
				<p className="flex items-center gap-1.5 text-xs">
					<CalendarIcon className="size-3.5 shrink-0" aria-hidden />
					<span>Published {formatDate(article.publishedAt)}</span>
				</p>
			</CardContent>
		</Card>
	);
}

export const Route = createFileRoute("/(main)/_layout/blog/$postId")({
	loader: ({ params }) => {
		const article = findArticle(params.postId);
		if (!article) {
			throw notFound();
		}
		return { article };
	},
	head: ({ loaderData }) => {
		const article = loaderData?.article;
		if (!article) {
			return {};
		}
		const title = article.title;
		const description = article.excerpt;
		const ogImage = article.coverImage;
		return {
			meta: [
				{ title },
				{ name: "description", content: description },
				{ property: "og:title", content: title },
				{ property: "og:description", content: description },
				...(ogImage
					? [{ property: "og:image", content: ogImage } as const]
					: []),
			],
		};
	},
	notFoundComponent: PostNotFound,
	component: PostPage,
});

function PostNotFound() {
	return (
		<main className="container mx-auto max-w-2xl px-4 py-16">
			<Card>
				<CardHeader>
					<CardTitle>Post not found</CardTitle>
					<CardDescription>
						This URL may be outdated, or the post was removed.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Button asChild>
						<Link to="/blog">Back to blog</Link>
					</Button>
				</CardContent>
			</Card>
		</main>
	);
}

function PostPage() {
	const { article } = Route.useLoaderData();
	const [copied, setCopied] = useState(false);
	const [pageUrl, setPageUrl] = useState("");

	useEffect(() => {
		setPageUrl(window.location.href);
	}, []);

	const related = useMemo(() => {
		return ALL_ARTICLES.filter(
			(a) => a.id !== article.id && a.category === article.category,
		)
			.sort(
				(a, b) =>
					new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
			)
			.slice(0, 3);
	}, [article.category, article.id]);

	const shareHref =
		pageUrl.length > 0
			? `https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(pageUrl)}`
			: undefined;

	async function copyLink() {
		const url = typeof window !== "undefined" ? window.location.href : "";
		try {
			await navigator.clipboard.writeText(url);
			setCopied(true);
			window.setTimeout(() => setCopied(false), 2000);
		} catch {
			setCopied(false);
		}
	}

	return (
		<main className="min-h-screen">
			<article>
				<div className="border-b bg-muted/30">
					<div className="container mx-auto max-w-3xl px-4 py-6">
						<Button
							variant="ghost"
							size="sm"
							className="mb-4 -ml-2 gap-1"
							asChild
						>
							<Link to="/blog">
								<ArrowLeftIcon className="size-4" />
								Blog
							</Link>
						</Button>
						<div className="mb-6 flex flex-wrap items-center gap-2">
							<Badge variant="secondary">{article.category}</Badge>
							<span className="text-muted-foreground text-sm">
								{formatDate(article.publishedAt)}
							</span>
							<span className="text-muted-foreground text-sm">·</span>
							<span className="flex items-center gap-1 text-muted-foreground text-sm">
								<ClockIcon className="size-3.5" aria-hidden />
								{article.readTimeMinutes} min read
							</span>
						</div>
						<h1 className="font-semibold text-3xl tracking-tight md:text-4xl lg:text-5xl">
							{article.title}
						</h1>
						<p className="mt-4 max-w-2xl text-muted-foreground text-lg leading-relaxed">
							{article.excerpt}
						</p>
					</div>
				</div>

				<div className="container mx-auto max-w-3xl px-4">
					<div className="-mt-4 mb-10 overflow-hidden rounded-xl border bg-card shadow-sm md:-mt-8">
						<img
							src={article.coverImage}
							alt=""
							className="aspect-21/9 w-full object-cover"
							width={1600}
							height={686}
						/>
					</div>

					<div className="flex flex-col gap-8 pb-10 lg:flex-row lg:gap-12">
						<div className="min-w-0 flex-1">
							<div className="mb-8 md:hidden">
								<AuthorCard article={article} />
							</div>

							<ArticleBody blocks={article.body} />

							<Separator className="my-10" />

							<div className="flex flex-wrap items-center gap-2">
								<span className="text-muted-foreground text-sm">Tags</span>
								{article.tags.map((tag) => (
									<Badge key={tag} variant="outline">
										{tag}
									</Badge>
								))}
							</div>

							<div className="mt-6 flex flex-wrap gap-2">
								<Button
									type="button"
									variant="outline"
									size="sm"
									className="gap-2"
									onClick={() => void copyLink()}
								>
									<Link2Icon className="size-4" aria-hidden />
									{copied ? "Copied" : "Copy link"}
								</Button>
								{shareHref ? (
									<Button
										type="button"
										variant="outline"
										size="sm"
										className="gap-2"
										asChild
									>
										<a
											href={shareHref}
											target="_blank"
											rel="noopener noreferrer"
										>
											<Share2Icon className="size-4" aria-hidden />
											Share
										</a>
									</Button>
								) : (
									<Button
										type="button"
										variant="outline"
										size="sm"
										className="gap-2"
										disabled
									>
										<Share2Icon className="size-4" aria-hidden />
										Share
									</Button>
								)}
							</div>
						</div>

						<aside className="shrink-0 lg:w-72">
							<div className="space-y-6 lg:sticky lg:top-24">
								<div className="hidden md:block">
									<AuthorCard article={article} />
								</div>

								{related.length > 0 && (
									<Card>
										<CardHeader className="pb-3">
											<CardTitle className="text-base">
												Related in {article.category}
											</CardTitle>
											<CardDescription>
												More from the same section of the journal.
											</CardDescription>
										</CardHeader>
										<CardContent className="space-y-1">
											{related.map((r) => (
												<Link
													key={r.id}
													to="/blog/$postId"
													params={{ postId: r.slug }}
													className="block rounded-md px-2 py-2.5 hover:bg-accent"
												>
													<p className="line-clamp-2 font-medium text-sm leading-snug">
														{r.title}
													</p>
													<p className="mt-1 text-muted-foreground text-xs">
														{formatDate(r.publishedAt)}
													</p>
												</Link>
											))}
										</CardContent>
									</Card>
								)}
							</div>
						</aside>
					</div>
				</div>
			</article>
		</main>
	);
}
