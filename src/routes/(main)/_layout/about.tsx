import { createFileRoute, Link } from "@tanstack/react-router";
import {
	ArrowRightIcon,
	BookOpenIcon,
	ComponentIcon,
	GlobeIcon,
	LayersIcon,
	MailIcon,
	PhoneIcon,
	ShieldCheckIcon,
	TestTubeIcon,
	ZapIcon,
} from "lucide-react";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "#/components/ui/accordion";
import { Avatar, AvatarFallback } from "#/components/ui/avatar";
import { Button } from "#/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";
import { Separator } from "#/components/ui/separator";

export const Route = createFileRoute("/(main)/_layout/about")({
	component: About,
});

const CONTACT = {
	emailDisplay: "hello@example.com",
	emailHref: "mailto:hello@example.com",
	phoneDisplay: "+1 (415) 555-0142",
	phoneHref: "tel:+14155550142",
	github: "https://github.com",
} as const;

const FEATURES = [
	{
		icon: ZapIcon,
		title: "TanStack Start and Router",
		description:
			"File-based routes, type-safe links, and SSR-ready data loading so pages stay fast and predictable as you grow.",
	},
	{
		icon: BookOpenIcon,
		title: "Publishing-ready blog",
		description:
			"Article listings, detail pages, tags, and pagination wired to structured content—swap the JSON for CMS or MDX when you’re ready.",
	},
	{
		icon: ComponentIcon,
		title: "shadcn/ui on Tailwind CSS v4",
		description:
			"Accessible primitives you own, styled with a modern token-based theme and typography that reads well on any device.",
	},
	{
		icon: GlobeIcon,
		title: "Paraglide i18n",
		description:
			"Localized URLs and message catalogs are built in so you can ship multiple locales without bolting on a separate stack.",
	},
	{
		icon: ShieldCheckIcon,
		title: "Typed configuration",
		description:
			"T3-style environment validation keeps secrets and flags honest between local dev and production.",
	},
	{
		icon: TestTubeIcon,
		title: "Quality tooling",
		description:
			"Biome for lint and format, Vitest for tests, and React Hook Form with Zod for forms—fewer bikeshedded decisions.",
	},
] as const;

const PROJECTS = [
	{
		name: "NextPress",
		description:
			"This starter: a full-width editorial layout, blog, contacts, and admin scaffolding you can extend or strip down.",
		href: CONTACT.github,
		external: true,
		label: "View on GitHub",
	},
	{
		name: "Content kit",
		description:
			"Reusable article schema, author metadata, and tag utilities shared across listing and post pages.",
		href: "/blog",
		external: false,
		label: "Open blog",
	},
	{
		name: "Admin shell",
		description:
			"Protected dashboard routes for future CMS controls, user management, or analytics—ready for your backend.",
		href: "/admin",
		external: false,
		label: "See admin area",
	},
] as const;

const FAQ_ITEMS: Array<{ q: string; a: string }> = [
	{
		q: "What is NextPress?",
		a: "NextPress is an opinionated publishing starter for teams that want React, TanStack Start, and a real blog—without rebuilding routing, layout, and content plumbing from scratch.",
	},
	{
		q: "Can I use my own CMS or markdown?",
		a: "Yes. The demo uses JSON for articles so everything runs offline; replace the loaders with your CMS SDK, filesystem reads, or a headless API while keeping the same UI patterns.",
	},
	{
		q: "Is the admin area production-ready?",
		a: "The admin routes are a UI shell to extend. Add authentication, role checks, and your data layer before exposing anything sensitive.",
	},
	{
		q: "How do I deploy?",
		a: "Build with your host’s Vite or TanStack Start adapter. Set env vars through the validated env module and point production URLs in your site config.",
	},
];

function About() {
	return (
		<main className="container mx-auto max-w-6xl px-4 py-10">
			<header className="mb-12 space-y-4">
				<p className="font-medium text-muted-foreground text-sm tracking-wide uppercase">
					About
				</p>
				<h1 className="font-semibold text-3xl tracking-tight md:text-4xl">
					NextPress: a modern publishing starter
				</h1>
				<p className="max-w-3xl text-lg text-muted-foreground leading-relaxed">
					NextPress pairs TanStack Start with an editorial UI, a working blog,
					and sensible defaults for forms, i18n, and styling—so you spend time
					on story and product, not wiring fundamentals.
				</p>
				<div className="flex flex-wrap gap-3 pt-2">
					<Button asChild>
						<Link to="/contacts">
							Contact us
							<ArrowRightIcon className="size-4" aria-hidden />
						</Link>
					</Button>
					<Button variant="outline" asChild>
						<Link to="/blog">Explore the blog</Link>
					</Button>
				</div>
			</header>

			<section className="mb-16 space-y-6" aria-labelledby="features-heading">
				<div className="space-y-2">
					<h2
						id="features-heading"
						className="font-semibold text-2xl tracking-tight"
					>
						What you get
					</h2>
					<p className="max-w-2xl text-muted-foreground">
						Features chosen for real publishing workflows: performance,
						accessibility, and a path from demo data to production content.
					</p>
				</div>
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
			</section>

			<section className="mb-16 space-y-6" aria-labelledby="developer-heading">
				<h2
					id="developer-heading"
					className="font-semibold text-2xl tracking-tight"
				>
					About the developer
				</h2>
				<Card className="overflow-hidden border-border/80">
					<CardContent className="flex flex-col gap-6 p-6 sm:flex-row sm:items-start sm:gap-8">
						<Avatar size="lg" className="size-20 shrink-0">
							<AvatarFallback className="font-semibold text-lg">
								NP
							</AvatarFallback>
						</Avatar>
						<div className="min-w-0 space-y-3">
							<div>
								<p className="font-semibold text-lg">NextPress maintainer</p>
								<p className="text-muted-foreground text-sm">
									Product engineer · Design systems · Editorial tooling
								</p>
							</div>
							<p className="text-muted-foreground leading-relaxed">
								I build interfaces and content pipelines for teams that care
								about clarity and performance. NextPress started as a repeatable
								base for launch sites, magazines, and changelog-driven products—
								with room to grow into something uniquely yours.
							</p>
							<div className="flex flex-wrap gap-2 pt-1">
								<Button variant="outline" size="sm" asChild>
									<a
										href={CONTACT.github}
										target="_blank"
										rel="noopener noreferrer"
									>
										GitHub
									</a>
								</Button>
								<Button variant="outline" size="sm" asChild>
									<a href={CONTACT.emailHref}>{CONTACT.emailDisplay}</a>
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			</section>

			<section className="mb-16 space-y-6" aria-labelledby="projects-heading">
				<div className="space-y-2">
					<h2
						id="projects-heading"
						className="font-semibold text-2xl tracking-tight"
					>
						Projects
					</h2>
					<p className="max-w-2xl text-muted-foreground">
						Surface areas of this repo you can extend, theme, or connect to your
						own services.
					</p>
				</div>
				<div className="grid gap-4 md:grid-cols-3">
					{PROJECTS.map((project) => (
						<Card key={project.name} className="flex flex-col border-border/80">
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
			</section>

			<section className="mb-16 space-y-4" aria-labelledby="faq-heading">
				<h2 id="faq-heading" className="font-semibold text-2xl tracking-tight">
					FAQ
				</h2>
				<Accordion type="single" collapsible className="w-full">
					{FAQ_ITEMS.map((item, i) => (
						<AccordionItem key={item.q} value={`faq-${i}`}>
							<AccordionTrigger className="text-left">
								{item.q}
							</AccordionTrigger>
							<AccordionContent className="text-muted-foreground leading-relaxed">
								{item.a}
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			</section>

			<section
				className="rounded-2xl border bg-muted/30 p-6 sm:p-8"
				aria-labelledby="contact-heading"
			>
				<div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
					<div className="max-w-xl space-y-3">
						<h2
							id="contact-heading"
							className="font-semibold text-2xl tracking-tight"
						>
							Get in touch
						</h2>
						<p className="text-muted-foreground leading-relaxed">
							Questions about NextPress, partnerships, or a custom build? Reach
							out directly or visit the contact page for hours, location, and
							the full message form.
						</p>
						<Separator className="my-4 max-w-md" />
						<ul className="space-y-2 text-sm">
							<li className="flex flex-wrap items-center gap-2">
								<MailIcon className="size-4 shrink-0 text-muted-foreground" />
								<a
									className="font-medium underline-offset-4 hover:underline"
									href={CONTACT.emailHref}
								>
									{CONTACT.emailDisplay}
								</a>
							</li>
							<li className="flex flex-wrap items-center gap-2">
								<PhoneIcon className="size-4 shrink-0 text-muted-foreground" />
								<a
									className="font-medium underline-offset-4 hover:underline"
									href={CONTACT.phoneHref}
								>
									{CONTACT.phoneDisplay}
								</a>
							</li>
						</ul>
					</div>
					<div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">
						<Button size="lg" asChild>
							<Link to="/contacts">
								Go to contact page
								<ArrowRightIcon className="size-4" aria-hidden />
							</Link>
						</Button>
						<Button size="lg" variant="outline" asChild>
							<a
								href={CONTACT.github}
								target="_blank"
								rel="noopener noreferrer"
							>
								GitHub
							</a>
						</Button>
					</div>
				</div>
			</section>
		</main>
	);
}
