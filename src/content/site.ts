import type { LucideIcon } from "lucide-react";
import {
	BookOpenIcon,
	ComponentIcon,
	GlobeIcon,
	ShieldCheckIcon,
	TestTubeIcon,
	ZapIcon,
} from "lucide-react";

export const OFFICE = {
	name: "NextPress Studio",
	addressLines: ["1200 Market Street", "Suite 400", "San Francisco, CA 94102"],
	phoneDisplay: "+1 (415) 555-0142",
	phoneHref: "tel:+14155550142",
	emailDisplay: "hello@example.com",
	emailHref: "mailto:hello@example.com",
	github: "https://github.com",
	mapsSearch:
		"https://www.openstreetmap.org/search?query=1200%20Market%20Street%20San%20Francisco",
} as const;

export const HOURS: Array<{ days: string; hours: string }> = [
	{ days: "Monday – Friday", hours: "9:00 a.m. – 6:00 p.m. PT" },
	{ days: "Saturday", hours: "By appointment" },
	{ days: "Sunday", hours: "Closed" },
];

/** Alias for about-page CTAs; same lines as OFFICE contact fields. */
export const SITE_CONTACT = {
	emailDisplay: OFFICE.emailDisplay,
	emailHref: OFFICE.emailHref,
	phoneDisplay: OFFICE.phoneDisplay,
	phoneHref: OFFICE.phoneHref,
	github: OFFICE.github,
} as const;

export const ABOUT_INTRO = {
	kicker: "About",
	title: "NextPress: a modern publishing starter",
	lede: "NextPress pairs TanStack Start with an editorial UI, a working blog, and sensible defaults for forms, i18n, and styling—so you spend time on story and product, not wiring fundamentals.",
} as const;

export const FEATURES: ReadonlyArray<{
	icon: LucideIcon;
	title: string;
	description: string;
}> = [
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
];

export const PROJECTS: ReadonlyArray<{
	name: string;
	description: string;
	href: string;
	external: boolean;
	label: string;
}> = [
	{
		name: "NextPress",
		description:
			"This starter: a full-width editorial layout, blog, contacts, and admin scaffolding you can extend or strip down.",
		href: OFFICE.github,
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
];

export const ABOUT_FAQ_ITEMS: Array<{ q: string; a: string }> = [
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

export const CONTACT_FAQ_ITEMS: Array<{ q: string; a: string }> = [
	{
		q: "How quickly do you reply to messages?",
		a: "We aim to answer general inquiries within one business day. Support for existing customers may be faster depending on your plan.",
	},
	{
		q: "Do you offer demos or calls?",
		a: "Yes—mention your preferred times in the form and we will send a calendar link. We keep first calls to 25 minutes.",
	},
	{
		q: "Can I visit in person?",
		a: "Our studio welcomes scheduled visits. Ring the intercom at the lobby or email ahead so we can meet you downstairs.",
	},
];
