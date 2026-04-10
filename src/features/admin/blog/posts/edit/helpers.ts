import transliterate from "@sindresorhus/transliterate";

const SPECIAL_CYRILLIC_MAP: Record<string, string> = {
	Ъ: "a",
	ъ: "a",
	Ь: "a",
	ь: "a",
	Ѝ: "i",
	ѝ: "i",
};
const SPECIAL_CYRILLIC_REGEX = /[ЪъЬьЍѝ]/g;
const NON_ALNUM_DASH_REGEX = /[^a-z0-9]+/g;
const EDGE_DASHES_REGEX = /^-|-$/g;

/** Builds a URL-safe slug from a post title (latin-friendly). */
export function titleToSlug(title: string): string {
	const preparedTitle = title.trim();
	if (!preparedTitle) return "";

	return transliterate(
		preparedTitle.replace(
			SPECIAL_CYRILLIC_REGEX,
			(char) => SPECIAL_CYRILLIC_MAP[char] ?? char,
		),
	)
		.toLowerCase()
		.replace(NON_ALNUM_DASH_REGEX, "-")
		.replace(EDGE_DASHES_REGEX, "");
}

export function fieldError(errors: unknown[]): string | undefined {
	if (!errors?.length) return undefined;
	const first = errors[0];
	return typeof first === "string" ? first : String(first);
}
