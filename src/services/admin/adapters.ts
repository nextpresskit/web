import type {
	AdminPage,
	AdminPersonRef,
	AdminPost,
	AdminPostSeo,
	AdminTaxonomyRef,
	AdminUser,
} from "#/@types/admin";
import type {
	ApiAdminUser,
	ApiPost,
	ApiPostCategory,
	ApiPostSeo,
	ApiPostTag,
	ApiUserSummary,
} from "#/@types/api";

/**
 * The single place where backend response shapes become admin view models.
 * Screens import the view models from `#/@types/admin` and never touch raw API
 * objects, so a backend contract change is fixed here and nowhere else.
 */

const text = (value: string | null | undefined): string => value?.trim() ?? "";

const orNull = (value: string | null | undefined): string | null => {
	const trimmed = value?.trim();
	return trimmed ? trimmed : null;
};

const numberOrNull = (value: number | null | undefined): number | null =>
	typeof value === "number" && Number.isFinite(value) ? value : null;

export function toPersonRef(
	summary: ApiUserSummary | null | undefined,
	fallbackId?: string | null,
): AdminPersonRef | null {
	if (summary?.id) {
		const name = text(summary.displayName);
		return {
			id: summary.id,
			name: name || text(summary.email) || `User #${summary.id}`,
			email: orNull(summary.email),
		};
	}
	const id = text(fallbackId);
	return id ? { id, name: `User #${id}`, email: null } : null;
}

const toTaxonomyRef = (
	item: ApiPostCategory | ApiPostTag,
): AdminTaxonomyRef => ({
	id: item.id,
	name: item.name,
	slug: item.slug,
});

function toSeo(
	seo: ApiPostSeo | null | undefined,
	post: ApiPost,
): AdminPostSeo {
	const structured = seo?.structuredData;
	return {
		title: text(seo?.title) || post.title,
		description: text(seo?.description) || text(post.excerpt),
		canonicalUrl: text(seo?.canonicalUrl),
		robots: text(seo?.robots) || "index,follow",
		ogType: text(seo?.ogType) || "article",
		ogImage: text(seo?.ogImage),
		twitterCard: text(seo?.twitterCard) || "summary_large_image",
		structuredData:
			structured && typeof structured === "object" && !Array.isArray(structured)
				? (structured as Record<string, unknown>)
				: null,
	};
}

export function toAdminPost(post: ApiPost): AdminPost {
	const categories = post.categories ?? [];
	const primary =
		post.category ?? categories.find((category) => category.isPrimary) ?? null;
	return {
		id: post.id,
		uuid: post.uuid,
		title: post.title,
		slug: post.slug,
		subtitle: text(post.subtitle),
		excerpt: text(post.excerpt),
		content: post.content ?? "",
		status: text(post.status).toLowerCase() || "draft",
		type: text(post.type) || "article",
		format: text(post.format) || "standard",
		visibility: text(post.visibility) || "public",
		locale: text(post.locale),
		revision: numberOrNull(post.revision),
		author: toPersonRef(post.author, post.authorId),
		reviewer: toPersonRef(post.reviewer),
		lastEditedBy: toPersonRef(post.lastEditedBy),
		categories: categories.map(toTaxonomyRef),
		primaryCategory: primary ? toTaxonomyRef(primary) : null,
		tags: (post.tags ?? []).map(toTaxonomyRef),
		featuredImageUrl: orNull(post.featuredImage?.url),
		featuredImageAlt: text(post.featuredImage?.alt),
		wordCount: numberOrNull(post.metrics?.wordCount),
		readingTimeMinutes: numberOrNull(post.metrics?.readingTimeMinutes),
		seo: toSeo(post.seo, post),
		createdAt: post.createdAt,
		updatedAt: orNull(post.updatedAt),
		publishedAt: orNull(post.publishedAt),
		scheduledPublishAt: orNull(post.scheduledPublishAt),
	};
}

export function initialsOf(...parts: Array<string | null | undefined>): string {
	const letters = parts
		.map((part) => text(part))
		.filter(Boolean)
		.map((part) => part.charAt(0).toUpperCase());
	return letters.slice(0, 2).join("") || "?";
}

export function toAdminUser(user: ApiAdminUser): AdminUser {
	const firstName = text(user.firstName);
	const lastName = text(user.lastName);
	const fullName = [firstName, lastName].filter(Boolean).join(" ");
	return {
		id: user.id,
		uuid: user.uuid,
		firstName,
		lastName,
		fullName: fullName || user.email,
		initials: fullName
			? initialsOf(firstName, lastName)
			: initialsOf(user.email),
		email: user.email,
		active: Boolean(user.active),
		roles: [...(user.roles ?? [])].sort(),
		createdAt: orNull(user.createdAt),
	};
}

/**
 * Builds a page from a list the API returned for `limit + 1` rows: the extra
 * row only proves there is a next page and is dropped.
 */
export function toPageFromOverfetch<TApi, TView>(
	rows: TApi[],
	limit: number,
	offset: number,
	map: (row: TApi) => TView,
): AdminPage<TView> {
	return {
		items: rows.slice(0, limit).map(map),
		total: null,
		limit,
		offset,
		hasNextPage: rows.length > limit,
	};
}

/** Builds a page from an API response that reports the total. */
export function toPageWithTotal<TApi, TView>(
	rows: TApi[],
	total: number,
	limit: number,
	offset: number,
	map: (row: TApi) => TView,
): AdminPage<TView> {
	return {
		items: rows.map(map),
		total,
		limit,
		offset,
		hasNextPage: offset + rows.length < total,
	};
}
