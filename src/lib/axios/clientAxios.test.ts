import { AxiosError, AxiosHeaders } from "axios";
import { describe, expect, it } from "vitest";
import {
	ApiConfigError,
	DEFAULT_DEV_API_URL,
	getApiErrorMessage,
	resolveApiBaseUrl,
	shouldRetryApiError,
} from "./clientAxios";

function httpError(status?: number) {
	const config = { headers: new AxiosHeaders() };
	return new AxiosError(
		"failed",
		undefined,
		config,
		undefined,
		status === undefined
			? undefined
			: { status, statusText: "", headers: {}, config, data: {} },
	);
}

describe("resolveApiBaseUrl", () => {
	it("uses VITE_API_URL without trailing slashes", () => {
		expect(resolveApiBaseUrl({ VITE_API_URL: " https://api.test/v1/ " })).toBe(
			"https://api.test/v1",
		);
	});

	it("falls back to the backend dev port in development only", () => {
		expect(resolveApiBaseUrl({ DEV: true })).toBe(DEFAULT_DEV_API_URL);
		expect(resolveApiBaseUrl({ DEV: false, VITE_API_URL: "" })).toBeUndefined();
	});
});

describe("getApiErrorMessage", () => {
	it("explains missing configuration", () => {
		expect(getApiErrorMessage(new ApiConfigError())).toMatch(/VITE_API_URL/);
	});

	it("explains an unreachable backend", () => {
		expect(getApiErrorMessage(httpError(), "http://localhost:9090")).toMatch(
			/Cannot reach the API at http:\/\/localhost:9090/,
		);
	});

	it("explains auth and missing endpoints", () => {
		expect(getApiErrorMessage(httpError(401))).toMatch(/not signed in/);
		expect(getApiErrorMessage(httpError(404), "http://x.test")).toMatch(/404/);
	});
});

describe("shouldRetryApiError", () => {
	it("does not retry config or client errors", () => {
		expect(shouldRetryApiError(0, new ApiConfigError())).toBe(false);
		expect(shouldRetryApiError(0, httpError(404))).toBe(false);
	});

	it("retries network/server errors once", () => {
		expect(shouldRetryApiError(0, httpError())).toBe(true);
		expect(shouldRetryApiError(1, httpError(500))).toBe(false);
	});
});
