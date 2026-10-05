#!/usr/bin/env node
/**
 * Generates the abstract demo images used by the sample blog and shop data.
 *
 * The images are drawn here from a seeded random generator, so they contain no
 * photos, people or third-party artwork and ship under the repository licence.
 * Re-run with `bun scripts/generate-demo-images.mjs` (or `node …`) after changing
 * the lists below; output is deterministic.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "demo");

/** Dark, saturated palettes so light overlay text stays readable. */
const PALETTES = [
	["#0f172a", "#1e3a8a", "#38bdf8", "#f472b6"],
	["#111827", "#4c1d95", "#a78bfa", "#fbbf24"],
	["#052e16", "#065f46", "#34d399", "#facc15"],
	["#1c1917", "#7c2d12", "#fb923c", "#fde68a"],
	["#172554", "#0e7490", "#67e8f9", "#f9a8d4"],
	["#18181b", "#831843", "#f472b6", "#93c5fd"],
	["#0c0a09", "#3f6212", "#bef264", "#60a5fa"],
	["#020617", "#312e81", "#818cf8", "#5eead4"],
];

const BLOG = [
	"introducing-next-press",
	"tanstack-router-file-routing",
	"designing-readable-long-form",
	"pagination-ux-checklist",
	"from-idea-to-roadmap",
	"css-tokens-at-scale",
	"streaming-ssr-notes",
	"writing-better-release-notes",
	"editorial-calendar-basics",
	"open-source-sustainability",
	"form-validation-patterns",
	"microcopy-for-empty-states",
	"measuring-content-roi",
	"draft-review-playbook",
	"security-basics-for-frontends",
	"brand-voice-and-tone",
	"year-one-retrospective",
	"search-and-discovery-on-blogs",
];

const SHOP = [
	"notebook",
	"notebook-2",
	"notebook-3",
	"tote",
	"tote-2",
	"mug",
	"mug-2",
	"waves",
	"waves-detail",
	"wax",
	"wax-open",
	"tee",
	"tee-back",
	"calendar",
	"calendar-cards",
	"blocks",
	"blocks-frame",
];

function hash(str) {
	let h = 2166136261;
	for (let i = 0; i < str.length; i++) {
		h ^= str.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	return h >>> 0;
}

function rng(seed) {
	let a = hash(seed);
	return () => {
		a = (a + 0x6d2b79f5) >>> 0;
		let t = a;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

const r1 = (n) => Math.round(n * 10) / 10;

function svg(seed, width, height) {
	const rand = rng(seed);
	const [bg, mid, accent, spark] = PALETTES[hash(seed) % PALETTES.length];
	const shapes = [];
	const count = 5 + Math.floor(rand() * 5);
	for (let i = 0; i < count; i++) {
		const fill = [mid, accent, spark][i % 3];
		const opacity = r1(0.25 + rand() * 0.5);
		const cx = r1(rand() * width);
		const cy = r1(rand() * height);
		const size = r1((0.12 + rand() * 0.35) * Math.max(width, height));
		if (rand() < 0.55) {
			shapes.push(
				`<circle cx="${cx}" cy="${cy}" r="${r1(size / 2)}" fill="${fill}" opacity="${opacity}"/>`,
			);
		} else {
			const rot = Math.round(rand() * 90);
			shapes.push(
				`<rect x="${r1(cx - size / 2)}" y="${r1(cy - size / 4)}" width="${size}" height="${r1(size / 2)}" rx="${r1(size / 12)}" fill="${fill}" opacity="${opacity}" transform="rotate(${rot} ${cx} ${cy})"/>`,
			);
		}
	}
	const lines = [];
	const step = Math.max(width, height) / 14;
	for (let i = 1; i < 14; i++) {
		lines.push(
			`<line x1="${r1(i * step)}" y1="0" x2="${r1(i * step - height * 0.4)}" y2="${height}"/>`,
		);
	}
	return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="Abstract demo artwork">
<defs>
<linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${bg}"/><stop offset="1" stop-color="${mid}"/></linearGradient>
<filter id="b" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="${Math.round(Math.min(width, height) / 18)}"/></filter>
</defs>
<rect width="${width}" height="${height}" fill="url(#g)"/>
<g filter="url(#b)">${shapes.join("")}</g>
<g stroke="#ffffff" stroke-opacity="0.06" stroke-width="2">${lines.join("")}</g>
</svg>
`;
}

function write(dir, name, width, height) {
	const file = join(root, dir, `${name}.svg`);
	mkdirSync(dirname(file), { recursive: true });
	writeFileSync(file, svg(`${dir}/${name}`, width, height));
}

for (const slug of BLOG) write("blog", slug, 1600, 900);
for (const name of SHOP) write("shop", name, 640, 480);
console.log(`Wrote ${BLOG.length} blog and ${SHOP.length} shop images to ${root}`);
