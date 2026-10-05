/**
 * Raw response shapes of the NextPressKit backend (nextpresskit/backend,
 * docs/openapi.yaml). Only the fields the web app reads are typed; everything
 * is treated as possibly missing because older backends omit some of them.
 * Map these to view models in `src/services/admin/adapters.ts` only.
 */

export type ApiUserSummary = {
	id: string;
	uuid?: string;
	displayName?: string;
	email?: string | null;
	avatarUrl?: string | null;
};

export type ApiPostCategory = {
	id: string;
	name: string;
	slug: string;
	isPrimary?: boolean;
};

export type ApiPostTag = {
	id: string;
	name: string;
	slug: string;
};

export type ApiPostSeo = {
	title?: string | null;
	description?: string | null;
	canonicalUrl?: string | null;
	robots?: string | null;
	ogType?: string | null;
	ogImage?: string | null;
	twitterCard?: string | null;
	structuredData?: unknown;
};

export type ApiPostMetrics = {
	wordCount?: number | null;
	readingTimeMinutes?: number | null;
	viewCount?: number | null;
};

export type ApiPostFeaturedImage = {
	url?: string | null;
	alt?: string | null;
};

/** `postToJSON` in internal/modules/posts/transport/http_handler.go. */
export type ApiPost = {
	id: number;
	uuid: string;
	authorId?: string | null;
	author?: ApiUserSummary | null;
	reviewer?: ApiUserSummary | null;
	lastEditedBy?: ApiUserSummary | null;
	title: string;
	slug: string;
	subtitle?: string | null;
	excerpt?: string | null;
	content?: string | null;
	type?: string | null;
	format?: string | null;
	visibility?: string | null;
	locale?: string | null;
	timezone?: string | null;
	status: string;
	revision?: number | null;
	categories?: ApiPostCategory[] | null;
	category?: ApiPostCategory | null;
	tags?: ApiPostTag[] | null;
	featuredImage?: ApiPostFeaturedImage | null;
	seo?: ApiPostSeo | null;
	metrics?: ApiPostMetrics | null;
	createdAt: string;
	updatedAt?: string | null;
	publishedAt?: string | null;
	scheduledPublishAt?: string | null;
};

/** `GET /admin/posts` */
export type ApiAdminPostsResponse = { posts: ApiPost[] };

/** User as returned by `GET /admin/users` and `GET /admin/users/{id}`. */
export type ApiAdminUser = {
	id: number;
	uuid: string;
	firstName: string;
	lastName: string;
	email: string;
	active: boolean;
	roles?: string[] | null;
	createdAt?: string | null;
	updatedAt?: string | null;
};

/** `GET /admin/users` */
export type ApiAdminUsersResponse = {
	users: ApiAdminUser[];
	total: number;
	limit: number;
	offset: number;
};
