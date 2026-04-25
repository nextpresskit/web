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
export const refresh = () =>
	clientAxios.post<RefreshResponse>("/auth/refreshAccessToken");

export const getCurrentUser = (): Promise<AxiosResponse<User>> =>
	clientAxios.get<User>("/auth/user");
