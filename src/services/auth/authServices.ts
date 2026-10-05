import { queryOptions } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import type { User } from "@/@types/user";
import { clientAxios } from "@/lib/axios/clientAxios";

export type LoginRequest = {
	email: string;
	password: string;
};

export type LoginResponse = {
	/** Present when the API returns tokens in JSON; omit when using HTTP-only cookies only. */
	tokens: {
		accessToken: string;
		refreshToken: string;
	};
	user: User;
};

export type LogoutResponse = {
	data: {
		message: string;
	};
};

export type RefreshResponse = {
	data: {
		accessToken: string;
		refreshToken?: string;
	};
};

export const login = (data: LoginRequest) =>
	clientAxios.post<LoginResponse>("/auth/login", data);

export const logout = () => clientAxios.post<LogoutResponse>("/auth/logout");

/** Uses refresh cookie when the API issues HTTP-only session cookies. */
export const refresh = () => clientAxios.post<RefreshResponse>("/auth/refresh");

/** Backend wraps the profile: `GET /auth/me` → `{ user: User }`. */
export type CurrentUserResponse = { user: User };

export const getCurrentUser = (): Promise<AxiosResponse<CurrentUserResponse>> =>
	clientAxios.get<CurrentUserResponse>("/auth/me");

export const currentUserQueryKey = ["auth", "me"] as const;

/** Signed-in user, or `null` when signed out or the API is unavailable. */
export const currentUserQueryOptions = queryOptions({
	queryKey: currentUserQueryKey,
	queryFn: async (): Promise<User | null> => {
		try {
			const response = await getCurrentUser();
			return response.data.user ?? null;
		} catch {
			return null;
		}
	},
	retry: false,
	staleTime: 60_000,
});
