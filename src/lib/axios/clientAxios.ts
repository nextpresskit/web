import axios, { isAxiosError } from "axios";

/** Default backend address in development: `nextpresskit/backend` listens on APP_PORT=9090. */
export const DEFAULT_DEV_API_URL = "http://localhost:9090";

type ApiEnv = { VITE_API_URL?: string; DEV?: boolean };

/**
 * Resolves the backend base URL from `VITE_API_URL`.
 * Development falls back to {@link DEFAULT_DEV_API_URL}; production builds
 * return `undefined` so requests fail with a clear configuration error instead
 * of hitting the web server.
 */
export function resolveApiBaseUrl(env: ApiEnv): string | undefined {
	const configured = env.VITE_API_URL?.trim();
	if (configured) {
		return configured.replace(/\/+$/, "");
	}
	return env.DEV ? DEFAULT_DEV_API_URL : undefined;
}

export const API_BASE_URL = resolveApiBaseUrl(import.meta.env);

export class ApiConfigError extends Error {
	constructor() {
		super(
			"The API URL is not configured. Set VITE_API_URL (see .env.example) to the NextPressKit backend address.",
		);
		this.name = "ApiConfigError";
	}
}

export const clientAxios = axios.create({
	...(API_BASE_URL ? { baseURL: API_BASE_URL } : {}),
	// The backend's default auth mode uses HTTP-only cookies (JWT_AUTH_SOURCE=cookie).
	// The backend must list this app's origin in CORS_ORIGINS for credentialed requests.
	withCredentials: true,
	timeout: 15_000,
});

clientAxios.interceptors.request.use((config) => {
	if (!config.baseURL) {
		throw new ApiConfigError();
	}
	return config;
});

/** HTTP status of an API error, if the server answered. */
export function getApiErrorStatus(error: unknown): number | undefined {
	return isAxiosError(error) ? error.response?.status : undefined;
}

/** Human-readable explanation of a failed API call, for error states. */
export function getApiErrorMessage(
	error: unknown,
	baseUrl: string | undefined = API_BASE_URL,
): string {
	if (error instanceof ApiConfigError) {
		return error.message;
	}
	if (isAxiosError(error)) {
		const status = error.response?.status;
		if (status === undefined) {
			return `Cannot reach the API at ${baseUrl ?? "(not configured)"}. Check that the backend is running and that VITE_API_URL and the backend's CORS_ORIGINS are set.`;
		}
		if (status === 401) {
			return "You are not signed in, or your session has expired. Sign in and try again.";
		}
		if (status === 403) {
			return "Your account does not have permission to view this.";
		}
		if (status === 404) {
			return `The API at ${baseUrl} does not provide this endpoint (404). Check VITE_API_URL and the backend version.`;
		}
		return `The API returned an error (HTTP ${status}). Try again later.`;
	}
	return "Something went wrong while loading data.";
}

/** TanStack Query retry policy: never retry configuration or 4xx errors. */
export function shouldRetryApiError(failureCount: number, error: unknown) {
	if (error instanceof ApiConfigError) {
		return false;
	}
	const status = getApiErrorStatus(error);
	if (status !== undefined && status >= 400 && status < 500) {
		return false;
	}
	return failureCount < 1;
}
