/**
 * View models for the admin screens. Built from backend responses by
 * `src/services/admin/adapters.ts`; components never read raw API shapes.
 */

export type AdminPostStatus = "draft" | "published" | "archived";

/** A person referenced by a post (author, reviewer, last editor). */
export type AdminPersonRef = {
	id: string;
	name: string;
	email: string | null;
};

export type AdminTaxonomyRef = {
	id: string;
	name: string;
	slug: string;
};

export type AdminPostSeo = {
	title: string;
	description: string;
	canonicalUrl: string;
	robots: string;
	ogType: string;
	ogImage: string;
	twitterCard: string;
	structuredData: Record<string, unknown> | null;
};

export type AdminPost = {
	id: number;
	uuid: string;
	title: string;
	slug: string;
	subtitle: string;
	excerpt: string;
	content: string;
	/** Backend status; unknown values are kept as-is for display. */
	status: AdminPostStatus | (string & {});
	type: string;
	format: string;
	visibility: string;
	locale: string;
	revision: number | null;
	author: AdminPersonRef | null;
	reviewer: AdminPersonRef | null;
	lastEditedBy: AdminPersonRef | null;
	categories: AdminTaxonomyRef[];
	primaryCategory: AdminTaxonomyRef | null;
	tags: AdminTaxonomyRef[];
	featuredImageUrl: string | null;
	featuredImageAlt: string;
	wordCount: number | null;
	readingTimeMinutes: number | null;
	seo: AdminPostSeo;
	createdAt: string;
	updatedAt: string | null;
	publishedAt: string | null;
	scheduledPublishAt: string | null;
};

export type AdminUser = {
	id: number;
	uuid: string;
	firstName: string;
	lastName: string;
	fullName: string;
	initials: string;
	email: string;
	active: boolean;
	roles: string[];
	createdAt: string | null;
};

/** One page of a server-paginated list. */
export type AdminPage<T> = {
	items: T[];
	/** Total matches when the API reports it; `null` when unknown. */
	total: number | null;
	limit: number;
	offset: number;
	hasNextPage: boolean;
};
