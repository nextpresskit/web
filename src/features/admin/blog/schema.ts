import { z } from "zod";

const focalPointSchema = z.object({
	x: z.number(),
	y: z.number(),
});

const authorSchema = z.object({
	id: z.string(),
	displayName: z.string(),
	email: z.string(),
	role: z.string().optional(),
	avatarUrl: z.string().nullable().optional(),
});

const coAuthorSchema = z.object({
	id: z.string(),
	displayName: z.string(),
	email: z.string().optional(),
	role: z.string().optional(),
	avatarUrl: z.string().nullable().optional(),
	contribution: z.string().optional(),
});

const categorySchema = z.object({
	id: z.string(),
	name: z.string(),
	slug: z.string(),
	isPrimary: z.boolean().optional(),
});

const tagSchema = z.object({
	id: z.string(),
	name: z.string(),
	slug: z.string(),
});

const seriesSchema = z
	.object({
		id: z.string(),
		title: z.string(),
		slug: z.string(),
		partIndex: z.number(),
		partLabel: z.string(),
	})
	.nullable();

const featuredImageSchema = z.object({
	url: z.string(),
	alt: z.string(),
	width: z.number(),
	height: z.number(),
	focalPoint: focalPointSchema,
	credit: z.string(),
	license: z.string(),
});

const galleryItemSchema = z.object({
	url: z.string(),
	caption: z.string(),
	order: z.number(),
});

const seoSchema = z.object({
	title: z.string(),
	description: z.string().nullable(),
	canonicalUrl: z.string().nullable(),
	robots: z.string(),
	ogType: z.string(),
	ogImage: z.string().nullable(),
	twitterCard: z.string(),
	structuredData: z.record(z.string(), z.unknown()).nullable(),
});

const metricsSchema = z.object({
	wordCount: z.number(),
	characterCount: z.number(),
	readingTimeMinutes: z.number(),
	estReadTimeSeconds: z.number(),
	viewCount: z.number(),
	uniqueVisitors7d: z.number(),
	scrollDepthAvgPercent: z.number().nullable(),
	bounceRatePercent: z.number().nullable(),
	avgTimeOnPageSeconds: z.number().nullable(),
	commentCount: z.number(),
	likeCount: z.number(),
	shareCount: z.number(),
	bookmarkCount: z.number(),
});

const engagementSchema = z.object({
	allowComments: z.boolean(),
	commentsModeration: z.string(),
	newsletterMentioned: z.boolean(),
	featuredOnHomepage: z.boolean(),
});

const flagsSchema = z.object({
	isFeatured: z.boolean(),
	isPinned: z.boolean(),
	isSponsored: z.boolean(),
	isMembersOnly: z.boolean(),
	paywallLevel: z.string(),
	containsAffiliateLinks: z.boolean(),
	aiGeneratedPercent: z.number(),
	humanReviewRequired: z.boolean(),
});

const changelogEntrySchema = z.object({
	at: z.string(),
	userId: z.string(),
	note: z.string(),
});

const workflowSchema = z.object({
	editorialStage: z.string(),
	contentWarnings: z.array(z.string()),
	legalReview: z.string(),
	embargoUntil: z.string().nullable(),
	revision: z.number(),
	changelog: z.array(changelogEntrySchema),
});

const syndicationEntrySchema = z.object({
	platform: z.string(),
	url: z.string(),
	status: z.string(),
});

export const schema = z.object({
	id: z.number(),
	title: z.string(),
	type: z.string(),
	status: z.string(),
	target: z.string(),
	limit: z.string(),
	reviewer: z.string(),
	slug: z.string(),
	uuid: z.string(),
	excerpt: z.string(),
	subtitle: z.string(),
	bodyMarkdownPreview: z.string(),
	format: z.string(),
	locale: z.string(),
	timezone: z.string(),
	author: authorSchema,
	coAuthors: z.array(coAuthorSchema),
	lastEditedBy: z.object({
		id: z.string(),
		displayName: z.string(),
		email: z.string().optional(),
	}),
	category: categorySchema,
	categories: z.array(categorySchema),
	tags: z.array(tagSchema),
	series: seriesSchema,
	featuredImage: featuredImageSchema.nullable(),
	gallery: z.array(galleryItemSchema),
	seo: seoSchema,
	metrics: metricsSchema,
	engagement: engagementSchema,
	flags: flagsSchema,
	workflow: workflowSchema,
	syndication: z.array(syndicationEntrySchema),
	relatedPostIds: z.array(z.number()),
	translationGroupId: z.string().nullable(),
	translations: z.array(z.unknown()),
	createdAt: z.string(),
	updatedAt: z.string(),
	publishedAt: z.string().nullable(),
	scheduledPublishAt: z.string().nullable(),
	firstIndexedAt: z.string().nullable(),
	visibility: z.string(),
	passwordHint: z.string().nullable(),
	customFields: z.record(z.string(), z.unknown()),
});

export type BlogPosts = z.infer<typeof schema>;

export const blogCategoryListItemSchema = z.object({
	id: z.number(),
	name: z.string(),
	slug: z.string(),
	description: z.string().nullable(),
	postCount: z.number(),
	parentName: z.string().nullable(),
	createdAt: z.string(),
	updatedAt: z.string(),
});

export type BlogCategoryListItem = z.infer<typeof blogCategoryListItemSchema>;
