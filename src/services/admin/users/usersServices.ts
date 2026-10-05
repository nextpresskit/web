import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import type { AdminPage, AdminUser } from "#/@types/admin";
import type { ApiAdminUsersResponse } from "#/@types/api";
import { clientAxios } from "#/lib/axios/clientAxios";
import { toAdminUser, toPageWithTotal } from "#/services/admin/adapters";

export const ADMIN_USERS_PAGE_SIZE = 20;

export type AdminUsersParams = {
	page: number;
	q?: string | undefined;
	pageSize?: number | undefined;
};

/**
 * `GET /admin/users` (backend docs/openapi.yaml, permission `users:read`)
 * → `{ users, total, limit, offset }`.
 */
export async function fetchAdminUsers({
	page,
	q,
	pageSize = ADMIN_USERS_PAGE_SIZE,
}: AdminUsersParams): Promise<AdminPage<AdminUser>> {
	const offset = (Math.max(1, page) - 1) * pageSize;
	const response = await clientAxios.get<ApiAdminUsersResponse>(
		"/admin/users",
		{
			params: {
				limit: pageSize,
				offset,
				...(q?.trim() ? { q: q.trim() } : {}),
			},
		},
	);
	const data = response.data;
	if (!data || !Array.isArray(data.users) || typeof data.total !== "number") {
		throw new Error("Unexpected response from GET /admin/users.");
	}
	return toPageWithTotal(data.users, data.total, pageSize, offset, toAdminUser);
}

export const adminUsersQueryKey = ["admin", "users"] as const;

export const adminUsersQueryOptions = (params: AdminUsersParams) =>
	queryOptions({
		queryKey: [
			...adminUsersQueryKey,
			{
				page: params.page,
				q: params.q ?? "",
				pageSize: params.pageSize ?? ADMIN_USERS_PAGE_SIZE,
			},
		],
		queryFn: () => fetchAdminUsers(params),
		placeholderData: keepPreviousData,
	});
