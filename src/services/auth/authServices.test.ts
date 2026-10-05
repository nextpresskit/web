import type { InternalAxiosRequestConfig } from "axios";
import { afterEach, describe, expect, it } from "vitest";
import { clientAxios } from "#/lib/axios/clientAxios";
import { getCurrentUser, login, logout, refresh } from "./authServices";

const originalAdapter = clientAxios.defaults.adapter;
const calls: InternalAxiosRequestConfig[] = [];

function captureRequests(data: unknown = {}) {
	clientAxios.defaults.adapter = async (config) => {
		calls.push(config);
		return { data, status: 200, statusText: "OK", headers: {}, config };
	};
}

afterEach(() => {
	if (originalAdapter) {
		clientAxios.defaults.adapter = originalAdapter;
	}
	calls.length = 0;
});

describe("auth services match the backend routes", () => {
	it("refresh posts to /auth/refresh (backend contract)", async () => {
		captureRequests();
		await refresh();
		expect(calls[0]?.method).toBe("post");
		expect(calls[0]?.url).toBe("/auth/refresh");
	});

	it("uses /auth/login, /auth/logout and /auth/me", async () => {
		captureRequests({ user: { id: 1 } });
		await login({ email: "a@example.test", password: "x" });
		await logout();
		const me = await getCurrentUser();
		expect(calls.map((c) => `${c.method} ${c.url}`)).toEqual([
			"post /auth/login",
			"post /auth/logout",
			"get /auth/me",
		]);
		expect(me.data.user.id).toBe(1);
	});
});
