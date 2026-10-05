import { z } from "zod";

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

export const blogAuthorListItemSchema = z.object({
	id: z.string(),
	displayName: z.string(),
	email: z.string(),
	role: z.string(),
	avatarUrl: z.string().nullable(),
	bio: z.string(),
	status: z.string(),
	postCount: z.number(),
	createdAt: z.string(),
	updatedAt: z.string(),
});

export type BlogAuthorListItem = z.infer<typeof blogAuthorListItemSchema>;
