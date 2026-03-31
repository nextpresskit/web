import { createFileRoute, Link } from "@tanstack/react-router";
import {
	CalendarIcon,
	ChevronRightIcon,
	ClockIcon,
	RssIcon,
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
import { Input } from "#/components/ui/input";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "#/components/ui/pagination";
import articlesFile from "#/dummy_data/articles.json";

const PAGE_SIZE = 5;

const ALL_ARTICLES = articlesFile.articles;

type Article = (typeof articlesFile.articles)[number];

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

function paginationRange(
	current: number,
	total: number,
): Array<number | "ellipsis"> {
	if (total <= 7) {
		return Array.from({ length: total }, (_, i) => i + 1);
	}
	const set = new Set<number>([1, total]);
	for (let i = current - 1; i <= current + 1; i++) {
		if (i >= 1 && i <= total) {
			set.add(i);
		}
	}
	const sorted = [...set].sort((a, b) => a - b);
	const out: Array<number | "ellipsis"> = [];
	for (let i = 0; i < sorted.length; i++) {
		const cur = sorted[i];
		if (cur === undefined) {
			continue;
		}
		const prev = sorted[i - 1];
		if (prev !== undefined && cur - prev > 1) {
			out.push("ellipsis");
		}
		out.push(cur);
	}
	return out;
}

function scrollPaginationToTop() {
	window.scrollTo({ top: 0, behavior: "smooth" });
}

function tagCounts(articles: Article[]): [string, number][] {
	const map = new Map<string, number>();
	for (const a of articles) {
		for (const t of a.tags) {
			map.set(t, (map.get(t) ?? 0) + 1);
		}
	}
	return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);
}

export const Route = createFileRoute("/(main)/_layout/blog")({
	component: BlogPage,
});

function BlogPage() {
	const [page, setPage] = useState(1);
	const [category, setCategory] = useState<string | null>(null);
	const [tagFilter, setTagFilter] = useState<string | null>(null);

	const categories = useMemo(
		() => [...new Set(ALL_ARTICLES.map((a) => a.category))].sort(),
		[],
	);

	const filtered = useMemo(() => {
		return ALL_ARTICLES.filter((a) => {
			const catOk = category === null || a.category === category;
			const tagOk = tagFilter === null || a.tags.includes(tagFilter);
			return catOk && tagOk;
		}).sort(
			(a, b) =>
				new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
		);
	}, [category, tagFilter]);

	const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

	function pickCategory(next: string | null) {
		setCategory(next);
		setPage(1);
	}

	function pickTag(next: string | null) {
		setTagFilter(next);
		setPage(1);
	}

	useEffect(() => {
		setPage((p) => (p > totalPages ? totalPages : p));
	}, [totalPages]);

	const currentPage = Math.min(page, totalPages);
	const pageArticles = filtered.slice(
		(currentPage - 1) * PAGE_SIZE,
		currentPage * PAGE_SIZE,
	);

	const popularTags = useMemo(() => tagCounts(ALL_ARTICLES), []);

	const recentArticles = useMemo(() => {
		return [...ALL_ARTICLES]
			.sort(
				(a, b) =>
					new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
			)
			.slice(0, 5);
	}, []);

	const range = paginationRange(currentPage, totalPages);

	return (
		<main className="container mx-auto max-w-6xl px-4 py-10">
			<header className="mb-10 space-y-2">
				<h1 className="font-semibold text-3xl tracking-tight md:text-4xl">
					Blog
				</h1>
				<p className="max-w-2xl text-muted-foreground text-lg">
					Notes on product, engineering, and design — plus practical guides for
					building a calm editorial workflow.
				</p>
			</header>

			<div className="grid gap-10 lg:grid-cols-[1fr_18rem] lg:items-start xl:grid-cols-[1fr_20rem]">
				<div className="min-w-0 space-y-8">
					{(category !== null || tagFilter !== null) && (
						<div className="flex flex-wrap items-center gap-2 text-sm">
							<span className="text-muted-foreground">Filtered by:</span>
							{category !== null && (
								<Badge variant="secondary">{category}</Badge>
							)}
							{tagFilter !== null && (
								<Badge variant="secondary">#{tagFilter}</Badge>
							)}
							<Button
								variant="ghost"
								size="sm"
								className="h-7 text-xs"
								type="button"
								onClick={() => {
									pickCategory(null);
									pickTag(null);
								}}
							>
								Clear filters
							</Button>
						</div>
					)}

					<ul className="space-y-6">
						{pageArticles.map((article) => (
							<li key={article.id}>
								<Card className="transition-shadow hover:shadow-md">
									<CardHeader className="gap-3">
										<div className="flex flex-wrap items-center gap-2">
											<Badge variant="outline">{article.category}</Badge>
											<span className="text-muted-foreground text-xs">
												{formatDate(article.publishedAt)}
											</span>
										</div>
										<CardTitle className="text-xl leading-snug md:text-2xl">
											<a
												className="hover:text-primary"
												href={`/blog/${article.slug}`}
											>
												{article.title}
											</a>
										</CardTitle>
										<CardDescription className="text-base leading-relaxed">
											{article.excerpt}
										</CardDescription>
									</CardHeader>
									<CardContent className="flex flex-wrap items-center justify-between gap-4 border-t pt-6">
										<div className="flex items-center gap-3">
											<Avatar size="sm">
												<AvatarFallback>
													{authorInitials(article.author)}
												</AvatarFallback>
											</Avatar>
											<div>
												<p className="font-medium text-sm">{article.author}</p>
												<p className="flex items-center gap-3 text-muted-foreground text-xs">
													<span className="inline-flex items-center gap-1">
														<ClockIcon className="size-3.5" aria-hidden />
														{article.readTimeMinutes} min read
													</span>
												</p>
											</div>
										</div>
										<div className="flex flex-wrap gap-1.5">
											{article.tags.slice(0, 3).map((t) => (
												<button
													key={t}
													type="button"
													className="cursor-pointer rounded-full border border-transparent bg-transparent p-0"
													onClick={() => setTagFilter(t)}
												>
													<Badge variant="secondary" className="font-normal">
														{t}
													</Badge>
												</button>
											))}
										</div>
									</CardContent>
								</Card>
							</li>
						))}
					</ul>

					{filtered.length === 0 && (
						<Card>
							<CardContent className="py-12 text-center text-muted-foreground">
								No articles match these filters.
							</CardContent>
						</Card>
					)}

					{filtered.length > 0 && totalPages > 1 && (
						<Pagination>
							<PaginationContent className="flex-wrap">
								<PaginationItem>
									<PaginationPrevious
										href="#"
										className={
											currentPage <= 1
												? "pointer-events-none opacity-50"
												: undefined
										}
										onClick={(e) => {
											e.preventDefault();
											if (currentPage > 1) {
												setPage((p) => p - 1);
												scrollPaginationToTop();
											}
										}}
									/>
								</PaginationItem>
								{(() => {
									let lastPage = 0;
									return range.map((item) => {
										if (item === "ellipsis") {
											const key = `ellipsis-after-${lastPage}`;
											return (
												<PaginationItem key={key}>
													<PaginationEllipsis />
												</PaginationItem>
											);
										}
										lastPage = item;
										return (
											<PaginationItem key={item}>
												<PaginationLink
													href="#"
													isActive={item === currentPage}
													onClick={(e) => {
														e.preventDefault();
														if (item !== currentPage) {
															setPage(item);
															scrollPaginationToTop();
														}
													}}
												>
													{item}
												</PaginationLink>
											</PaginationItem>
										);
									});
								})()}
								<PaginationItem>
									<PaginationNext
										href="#"
										className={
											currentPage >= totalPages
												? "pointer-events-none opacity-50"
												: undefined
										}
										onClick={(e) => {
											e.preventDefault();
											if (currentPage < totalPages) {
												setPage((p) => p + 1);
												scrollPaginationToTop();
											}
										}}
									/>
								</PaginationItem>
							</PaginationContent>
						</Pagination>
					)}
				</div>

				<aside className="space-y-6 lg:sticky lg:top-24">
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-base">Categories</CardTitle>
							<CardDescription>
								Browse by topic — combines with tag filters.
							</CardDescription>
						</CardHeader>
						<CardContent className="flex flex-col gap-1">
							<Button
								variant={category === null ? "secondary" : "ghost"}
								size="sm"
								className="justify-start font-normal"
								type="button"
								onClick={() => pickCategory(null)}
							>
								All posts
							</Button>
							{categories.map((cat) => (
								<Button
									key={cat}
									variant={category === cat ? "secondary" : "ghost"}
									size="sm"
									className="justify-start font-normal"
									type="button"
									onClick={() => pickCategory(cat)}
								>
									{cat}
								</Button>
							))}
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-base">Fast links</CardTitle>
						</CardHeader>
						<CardContent className="flex flex-col gap-0.5">
							<Button
								variant="ghost"
								size="sm"
								className="justify-between"
								asChild
							>
								<Link to="/">
									Home
									<ChevronRightIcon className="size-4 opacity-50" />
								</Link>
							</Button>
							<Button
								variant="ghost"
								size="sm"
								className="justify-between"
								asChild
							>
								<Link to="/about">
									About
									<ChevronRightIcon className="size-4 opacity-50" />
								</Link>
							</Button>
							<Button
								variant="ghost"
								size="sm"
								className="justify-between"
								asChild
							>
								<Link to="/contacts">
									Contact
									<ChevronRightIcon className="size-4 opacity-50" />
								</Link>
							</Button>
							<Button
								variant="ghost"
								size="sm"
								className="justify-between"
								asChild
							>
								<Link to="/blog">
									Latest on the blog
									<ChevronRightIcon className="size-4 opacity-50" />
								</Link>
							</Button>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-base">About this journal</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3 text-muted-foreground text-sm leading-relaxed">
							<p>
								NextPress is a publishing playground: long-form articles,
								shorter updates, and tutorials for teams shipping content with
								modern web tooling.
							</p>
							<p>
								New posts typically land mid-week. Grab the RSS feed if you read
								in a reader app.
							</p>
							<Button variant="outline" size="sm" className="gap-2" asChild>
								<a href="/rss.xml">
									<RssIcon className="size-4" />
									RSS feed
								</a>
							</Button>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-base">Popular tags</CardTitle>
							<CardDescription>Click a tag to filter the list.</CardDescription>
						</CardHeader>
						<CardContent className="flex flex-wrap gap-2">
							{popularTags.map(([tag]) => (
								<button
									key={tag}
									type="button"
									className="cursor-pointer rounded-full border-0 bg-transparent p-0"
									onClick={() => pickTag(tagFilter === tag ? null : tag)}
								>
									<Badge
										variant={tagFilter === tag ? "default" : "outline"}
										className="font-normal"
									>
										{tag}
									</Badge>
								</button>
							))}
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-base">Recent posts</CardTitle>
						</CardHeader>
						<CardContent className="divide-y px-6">
							{recentArticles.map((a) => (
								<a
									key={a.id}
									className="-mx-2 block rounded-md px-2 py-3 first:pt-0 last:pb-3 hover:bg-accent/60"
									href={`/blog/${a.slug}`}
								>
									<p className="line-clamp-2 font-medium text-sm leading-snug">
										{a.title}
									</p>
									<p className="mt-1 flex items-center gap-1 text-muted-foreground text-xs">
										<CalendarIcon className="size-3.5 shrink-0" aria-hidden />
										{formatDate(a.publishedAt)}
									</p>
								</a>
							))}
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-base">Newsletter</CardTitle>
							<CardDescription>
								One digest per month — no daily noise.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<form
								className="space-y-2"
								onSubmit={(e) => {
									e.preventDefault();
								}}
							>
								<Input
									type="email"
									name="email"
									placeholder="you@example.com"
									autoComplete="email"
									aria-label="Email for newsletter"
								/>
								<Button type="submit" className="w-full" size="sm">
									Subscribe
								</Button>
								<p className="text-muted-foreground text-xs">
									We respect your inbox. Unsubscribe anytime.
								</p>
							</form>
						</CardContent>
					</Card>
				</aside>
			</div>
		</main>
	);
}
