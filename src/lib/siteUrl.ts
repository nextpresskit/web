/** Development default: `bun dev` serves the app on port 3000. */
export const DEFAULT_DEV_SITE_URL = "http://localhost:3000";

type SiteEnv = { VITE_SITE_URL?: string; DEV?: boolean };

/**
 * Public origin of this web app from `VITE_SITE_URL` (see .env.example), used
 * for absolute URLs in meta tags such as `og:image`. Development falls back to
 * {@link DEFAULT_DEV_SITE_URL}; production builds return `undefined` when unset.
 */
export function resolveSiteUrl(env: SiteEnv): string | undefined {
	const configured = env.VITE_SITE_URL?.trim();
	if (configured) {
		return configured.replace(/\/+$/, "");
	}
	return env.DEV ? DEFAULT_DEV_SITE_URL : undefined;
}

export const SITE_URL = resolveSiteUrl(import.meta.env);

/**
 * Turns a site-relative path (e.g. `/demo/blog/cover.svg`) into an absolute
 * URL. Absolute http(s) URLs pass through. Returns `undefined` when the site
 * URL is unknown, so callers can omit the tag instead of emitting a relative one.
 */
export function absoluteUrl(
	pathOrUrl: string | null | undefined,
	siteUrl: string | null | undefined = SITE_URL,
): string | undefined {
	const value = pathOrUrl?.trim();
	if (!value) return undefined;
	if (/^https?:\/\//i.test(value)) return value;
	if (!siteUrl) return undefined;
	try {
		return new URL(value, `${siteUrl}/`).toString();
	} catch {
		return undefined;
	}
}
