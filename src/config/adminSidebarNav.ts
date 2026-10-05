import {
	LayoutDashboard,
	type LucideIcon,
	Newspaper,
	Package,
	Users,
} from "lucide-react";

export type AdminNavLink = {
	title: string;
	url: string;
};

export type AdminNavItem = AdminNavLink & {
	icon: LucideIcon;
	items?: AdminNavLink[];
};

export const adminBrand = {
	name: "NextPressKit",
	tagline: "Admin",
};

/** Sidebar navigation: only sections that have routes under `src/routes/admin/_layout`. */
export const adminNav: AdminNavItem[] = [
	{
		title: "Dashboard",
		url: "/admin/dashboard",
		icon: LayoutDashboard,
	},
	{
		title: "Blog",
		url: "/admin/blog/posts",
		icon: Newspaper,
		items: [
			{ title: "Posts", url: "/admin/blog/posts" },
			{ title: "Categories", url: "/admin/blog/categories" },
			{ title: "Authors", url: "/admin/blog/authors" },
		],
	},
	{
		title: "Products",
		url: "/admin/products",
		icon: Package,
	},
	{
		title: "Users",
		url: "/admin/users",
		icon: Users,
	},
];

/** Human labels for admin path segments, used by the header breadcrumb. */
export const adminSegmentLabels: Record<string, string> = {
	admin: "Admin",
	dashboard: "Dashboard",
	blog: "Blog",
	posts: "Posts",
	categories: "Categories",
	authors: "Authors",
	products: "Products",
	users: "Users",
};

/** Paths that are real pages, so breadcrumb items link only where a route exists. */
export const adminLinkablePaths = new Set<string>([
	"/admin/dashboard",
	"/admin/blog/posts",
	"/admin/blog/categories",
	"/admin/blog/authors",
	"/admin/products",
	"/admin/users",
]);

/** `path` is the crumb's own pathname (unique key); `href` is set only when it is a real page. */
export type AdminCrumb = {
	label: string;
	path: string;
	href?: string | undefined;
};

/** Builds breadcrumb items for an admin pathname, e.g. `/admin/blog/posts/12`. */
export function buildAdminBreadcrumbs(pathname: string): AdminCrumb[] {
	const segments = pathname.split("/").filter(Boolean);
	const start = segments.indexOf("admin");
	if (start === -1) {
		return [];
	}
	const crumbs: AdminCrumb[] = [];
	let path = "";
	for (const [index, segment] of segments.slice(start).entries()) {
		path += `/${segment}`;
		if (index === 0) {
			continue;
		}
		const decoded = decodeURIComponent(segment);
		crumbs.push({
			label: adminSegmentLabels[decoded] ?? `#${decoded}`,
			path,
			href: adminLinkablePaths.has(path) ? path : undefined,
		});
	}
	return crumbs;
}
