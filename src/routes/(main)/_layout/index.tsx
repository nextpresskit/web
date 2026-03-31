import { createFileRoute, Link } from "@tanstack/react-router";
import {
	ArrowRightIcon,
	BookOpenIcon,
	CalendarIcon,
	ClockIcon,
	ExternalLinkIcon,
	LayersIcon,
	MailIcon,
	MapPinIcon,
	PhoneIcon,
	RssIcon,
	SparklesIcon,
} from "lucide-react";
import { useMemo } from "react";

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
import { ABOUT_INTRO, FEATURES, HOURS, OFFICE, PROJECTS } from "#/content/site";
import articlesFile from "#/dummy_data/articles.json";

export const Route = createFileRoute("/(main)/_layout/")({
	component: HomePage,
});

type Article = (typeof articlesFile.articles)[number];

const ALL_ARTICLES = articlesFile.articles;

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

function LatestGridTile({
	article,
	size,
}: {
	article: Article;
	size: "lg" | "sm";
}) {
	const isLg = size === "lg";
	return (
		<Link
			to="/blog/$postId"
			params={{ postId: article.slug }}
			className={
				isLg
					? "group relative min-h-[200px] overflow-hidden rounded-2xl ring-1 ring-border/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:min-h-0"
					: "group relative min-h-[160px] overflow-hidden rounded-2xl ring-1 ring-border/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:min-h-0"
			}
		>
			<img
				src={article.coverImage}
				alt=""
				className="absolute inset-0 size-full object-cover transition duration-500 group-hover:scale-[1.03]"
			/>
			<div
				className="absolute inset-0 bg-linear-to-t from-background/95 via-background/40 to-transparent"
				aria-hidden
			/>
			<div
				className={
					isLg
						? "relative flex h-full flex-col justify-end p-5 md:p-7"
						: "relative flex h-full flex-col justify-end p-4 md:p-5"
				}
			>
				<div className="mb-2 flex flex-wrap items-center gap-2">
					<Badge variant="secondary" className="backdrop-blur-sm">
						{article.category}
					</Badge>
					<span className="text-white/80 text-xs">
						{formatDate(article.publishedAt)} · {article.readTimeMinutes} min
					</span>
				</div>
				<h2
					className={
						isLg
							? "font-semibold text-2xl text-balance text-white tracking-tight drop-shadow-sm md:text-3xl"
							: "font-semibold text-base text-balance text-white tracking-tight drop-shadow-sm md:text-lg"
					}
				>
					{article.title}
				</h2>
				<p
					className={
						isLg
							? "mt-2 line-clamp-2 max-w-prose text-sm text-white/85 md:line-clamp-3 md:text-base"
							: "mt-1 line-clamp-2 text-xs text-white/85 md:text-sm"
					}
				>
					{article.excerpt}
				</p>
				<div className="mt-3 flex items-center gap-2">
					<Avatar
						size="sm"
						className="size-7 border border-white/20 data-[size=sm]:size-7"
					>
						<AvatarFallback className="bg-white/20 text-[10px] text-white">
							{authorInitials(article.author)}
						</AvatarFallback>
					</Avatar>
					<span className="text-white/90 text-xs font-medium">
						{article.author}
					</span>
				</div>
			</div>
		</Link>
	);
}

function HomePage() {
	const latestFive = useMemo(() => {
		return [...ALL_ARTICLES]
			.sort(
				(a, b) =>
					new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
			)
			.slice(0, 5);
	}, []);

	const [bigA, bigB, ...smalls] = latestFive;
	const smallRest = smalls.slice(0, 3);

	const topicCount = useMemo(() => {
		const tags = new Set<string>();
		for (const a of ALL_ARTICLES) {
			for (const t of a.tags) {
				tags.add(t);
			}
		}
		return tags.size;
	}, []);

	return (
		<>
			<section
				className="flex min-h-dvh w-full flex-col bg-muted/20"
				aria-labelledby="latest-stories-heading"
			>
				<div className="flex flex-1 flex-col gap-4 p-4 md:gap-5 md:p-6">
					<div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
						<div className="space-y-1">
							<p
								id="latest-stories-heading"
								className="font-medium text-muted-foreground text-xs uppercase tracking-widest"
							>
								Latest stories
							</p>
							<p className="max-w-xl text-muted-foreground text-sm md:text-base">
								Editorial highlights from the journal—full-width grid, two
								featured pieces and three quick reads.
							</p>
						</div>
						<Button variant="outline" asChild className="shrink-0">
							<Link to="/blog">
								<RssIcon className="size-4" aria-hidden />
								View all posts
							</Link>
						</Button>
					</div>

					{latestFive.length >= 5 ? (
						<div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-5 lg:gap-5">
							<div className="grid min-h-[420px] grid-rows-2 gap-4 lg:col-span-3 lg:min-h-0 lg:gap-5">
								{bigA && <LatestGridTile article={bigA} size="lg" />}
								{bigB && <LatestGridTile article={bigB} size="lg" />}
							</div>
							<div className="grid min-h-[480px] grid-rows-3 gap-4 lg:col-span-2 lg:min-h-0 lg:gap-5">
								{smallRest.map((article) => (
									<LatestGridTile
										key={article.id}
										article={article}
										size="sm"
									/>
								))}
							</div>
						</div>
					) : (
						<Card className="flex flex-1 items-center justify-center border-dashed">
							<CardContent className="py-16 text-center text-muted-foreground">
								Not enough articles to fill the hero grid.
							</CardContent>
						</Card>
					)}
				</div>
			</section>

			<section
				className="border-b bg-background py-16 md:py-24"
				aria-labelledby="about-home-heading"
			>
				<div className="container mx-auto max-w-6xl px-4">
					<div className="mb-12 max-w-3xl space-y-4">
						<p className="font-medium text-muted-foreground text-sm tracking-wide uppercase">
							{ABOUT_INTRO.kicker}
						</p>
						<h2
							id="about-home-heading"
							className="font-semibold text-3xl tracking-tight md:text-4xl"
						>
							{ABOUT_INTRO.title}
						</h2>
						<p className="text-lg text-muted-foreground leading-relaxed">
							{ABOUT_INTRO.lede}
						</p>
						<div className="flex flex-wrap gap-3 pt-2">
							<Button asChild>
								<Link to="/about">
									Read the full story
									<ArrowRightIcon className="size-4" aria-hidden />
								</Link>
							</Button>
							<Button variant="outline" asChild>
								<Link to="/blog">Browse the blog</Link>
							</Button>
						</div>
					</div>

					<div className="space-y-4">
						<h3 className="font-semibold text-2xl tracking-tight">
							What you get
						</h3>
						<p className="max-w-2xl text-muted-foreground">
							Same feature set as on the about page—performance, accessibility,
							and a path from demo data to production content.
						</p>
						<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
							{FEATURES.map((feature) => (
								<Card key={feature.title} className="border-border/80">
									<CardHeader className="space-y-3">
										<div className="flex size-10 items-center justify-center rounded-lg border bg-muted/50">
											<feature.icon
												className="size-5 text-foreground"
												aria-hidden
											/>
										</div>
										<CardTitle className="text-lg">{feature.title}</CardTitle>
									</CardHeader>
									<CardContent>
										<CardDescription className="text-base leading-relaxed">
											{feature.description}
										</CardDescription>
									</CardContent>
								</Card>
							))}
						</div>
					</div>
				</div>
			</section>

			<section
				className="border-b bg-muted/15 py-16 md:py-24"
				aria-labelledby="highlights-heading"
			>
				<div className="container mx-auto max-w-6xl px-4">
					<div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
						<div className="space-y-2">
							<p className="font-medium text-muted-foreground text-sm tracking-wide uppercase">
								At a glance
							</p>
							<h2
								id="highlights-heading"
								className="font-semibold text-3xl tracking-tight"
							>
								Built for editorial velocity
							</h2>
							<p className="max-w-xl text-muted-foreground">
								Live counts from your demo catalog—swap in CMS metrics when you
								connect a backend.
							</p>
						</div>
					</div>
					<div className="grid gap-4 sm:grid-cols-3">
						<Card>
							<CardHeader className="pb-2">
								<CardDescription>Published pieces</CardDescription>
								<CardTitle className="font-semibold text-4xl tabular-nums">
									{ALL_ARTICLES.length}
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-muted-foreground text-sm">
									Articles in the current JSON feed, ready to replace with your
									own source.
								</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="pb-2">
								<CardDescription>Taxonomy breadth</CardDescription>
								<CardTitle className="font-semibold text-4xl tabular-nums">
									{topicCount}
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-muted-foreground text-sm">
									Unique tags used across posts for filters and related reading.
								</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="pb-2">
								<CardDescription>Deep dives</CardDescription>
								<CardTitle className="font-semibold text-4xl tabular-nums">
									{Math.max(...ALL_ARTICLES.map((a) => a.readTimeMinutes), 0)}m
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-muted-foreground text-sm">
									Longest read time in the set—helps set expectations for your
									readers.
								</p>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>

			<section
				className="bg-background py-16 md:py-24"
				aria-labelledby="projects-home-heading"
			>
				<div className="container mx-auto max-w-6xl px-4">
					<div className="mb-10 space-y-2">
						<p className="font-medium text-muted-foreground text-sm tracking-wide uppercase">
							Explore the repo
						</p>
						<h2
							id="projects-home-heading"
							className="font-semibold text-3xl tracking-tight"
						>
							Projects & entry points
						</h2>
						<p className="max-w-2xl text-muted-foreground">
							Surface areas you can extend—mirrored from the about page.
						</p>
					</div>
					<div className="grid gap-4 md:grid-cols-3">
						{PROJECTS.map((project) => (
							<Card
								key={project.name}
								className="flex flex-col border-border/80"
							>
								<CardHeader>
									<div className="mb-2 flex items-center gap-2 text-muted-foreground">
										<LayersIcon className="size-4 shrink-0" aria-hidden />
										<span className="text-xs font-medium uppercase tracking-wide">
											Repository
										</span>
									</div>
									<CardTitle className="text-lg">{project.name}</CardTitle>
									<CardDescription className="text-base leading-relaxed">
										{project.description}
									</CardDescription>
								</CardHeader>
								<CardContent className="mt-auto pt-0">
									{project.external ? (
										<Button variant="link" className="h-auto px-0" asChild>
											<a
												href={project.href}
												target="_blank"
												rel="noopener noreferrer"
											>
												{project.label}
												<ArrowRightIcon className="size-4" aria-hidden />
											</a>
										</Button>
									) : (
										<Button variant="link" className="h-auto px-0" asChild>
											<Link to={project.href}>
												{project.label}
												<ArrowRightIcon className="size-4" aria-hidden />
											</Link>
										</Button>
									)}
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			<section
				className="border-t bg-muted/20 py-16 md:py-24"
				aria-labelledby="cta-heading"
			>
				<div className="container mx-auto max-w-6xl px-4">
					<Card className="overflow-hidden border-border/80 bg-linear-to-br from-primary/10 via-background to-background">
						<CardContent className="flex flex-col gap-6 p-8 md:flex-row md:items-center md:justify-between md:p-10">
							<div className="max-w-xl space-y-3">
								<div className="flex items-center gap-2 text-primary">
									<SparklesIcon className="size-5" aria-hidden />
									<span className="font-medium text-sm">Start reading</span>
								</div>
								<h2
									id="cta-heading"
									className="font-semibold text-2xl tracking-tight md:text-3xl"
								>
									Dig into long-form guides, changelogs, and product writing.
								</h2>
								<p className="text-muted-foreground leading-relaxed">
									Each post includes structured metadata—authors, categories,
									read times—so you can grow into search, newsletters, or paid
									tiers without redoing your templates.
								</p>
							</div>
							<div className="flex shrink-0 flex-col gap-3 sm:flex-row md:flex-col">
								<Button size="lg" asChild>
									<Link to="/blog">
										<BookOpenIcon className="size-4" aria-hidden />
										Open the blog
									</Link>
								</Button>
								<Button size="lg" variant="outline" asChild>
									<Link to="/about">Why NextPress</Link>
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			</section>

			<section
				className="bg-background pb-20 pt-16 md:pb-28 md:pt-20"
				aria-labelledby="home-contact-heading"
			>
				<div className="container mx-auto max-w-6xl px-4">
					<div className="grid gap-8 lg:grid-cols-[1fr_minmax(0,1.1fr)] lg:items-start">
						<div className="space-y-4">
							<p className="font-medium text-muted-foreground text-sm tracking-wide uppercase">
								Contact
							</p>
							<h2
								id="home-contact-heading"
								className="font-semibold text-3xl tracking-tight"
							>
								Visit or send a note
							</h2>
							<p className="text-muted-foreground leading-relaxed">
								Studio details match the contact page—use the form there for
								longer messages or scheduling.
							</p>
						</div>
						<Card className="border-border/80">
							<CardHeader>
								<CardTitle className="text-xl">NextPress Studio</CardTitle>
								<CardDescription>
									Direct lines, address, and weekly hours.
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="flex gap-3">
									<MapPinIcon
										className="mt-0.5 size-5 shrink-0 text-muted-foreground"
										aria-hidden
									/>
									<div className="space-y-1">
										<p className="font-medium text-sm">{OFFICE.name}</p>
										<address className="not-italic text-muted-foreground text-sm leading-relaxed">
											{OFFICE.addressLines.map((line) => (
												<span key={line} className="block">
													{line}
												</span>
											))}
										</address>
										<Button variant="link" className="h-auto p-0" asChild>
											<a
												href={OFFICE.mapsSearch}
												target="_blank"
												rel="noopener noreferrer"
												className="inline-flex items-center gap-1 text-sm"
											>
												Open in maps
												<ExternalLinkIcon className="size-3.5" aria-hidden />
											</a>
										</Button>
									</div>
								</div>

								<Separator />

								<ul className="grid gap-4 sm:grid-cols-2">
									<li className="flex gap-3">
										<PhoneIcon
											className="mt-0.5 size-5 shrink-0 text-muted-foreground"
											aria-hidden
										/>
										<div>
											<p className="font-medium text-sm">Phone</p>
											<a
												href={OFFICE.phoneHref}
												className="text-muted-foreground text-sm hover:text-foreground hover:underline"
											>
												{OFFICE.phoneDisplay}
											</a>
										</div>
									</li>
									<li className="flex gap-3">
										<MailIcon
											className="mt-0.5 size-5 shrink-0 text-muted-foreground"
											aria-hidden
										/>
										<div>
											<p className="font-medium text-sm">Email</p>
											<a
												href={OFFICE.emailHref}
												className="text-muted-foreground text-sm hover:text-foreground hover:underline"
											>
												{OFFICE.emailDisplay}
											</a>
										</div>
									</li>
								</ul>

								<Separator />

								<div className="flex gap-3">
									<ClockIcon
										className="mt-0.5 size-5 shrink-0 text-muted-foreground"
										aria-hidden
									/>
									<div className="min-w-0 flex-1 space-y-2">
										<p className="font-medium text-sm">Office hours</p>
										<dl className="space-y-1.5 text-sm">
											{HOURS.map((row) => (
												<div
													key={row.days}
													className="flex flex-col gap-0.5 sm:flex-row sm:justify-between sm:gap-4"
												>
													<dt className="text-muted-foreground">{row.days}</dt>
													<dd className="font-medium sm:text-right">
														{row.hours}
													</dd>
												</div>
											))}
										</dl>
									</div>
								</div>

								<div className="flex flex-wrap gap-3 pt-2">
									<Button asChild>
										<Link to="/contacts">
											Contact page
											<CalendarIcon className="size-4" aria-hidden />
										</Link>
									</Button>
									<Button variant="outline" asChild>
										<a
											href={OFFICE.github}
											target="_blank"
											rel="noopener noreferrer"
										>
											GitHub
										</a>
									</Button>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>
		</>
	);
}
