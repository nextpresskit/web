import {
	AudioWaveform,
	Command,
	Frame,
	GalleryVerticalEnd,
	Home,
	LucideMap,
	Newspaper,
	Package,
	PieChart,
} from "lucide-react";

export const data = {
	user: {
		name: "shadcn",
		email: "m@example.com",
		avatar: "/avatars/shadcn.jpg",
	},
	teams: [
		{
			name: "Acme Inc",
			logo: GalleryVerticalEnd,
			plan: "Enterprise",
		},
		{
			name: "Acme Corp.",
			logo: AudioWaveform,
			plan: "Startup",
		},
		{
			name: "Evil Corp.",
			logo: Command,
			plan: "Free",
		},
	],
	navMain: [
		{
			title: "Dashboard",
			url: "/admin/dashboard",
			icon: Home,
			isActive: true,
		},
		{
			title: "Blog",
			url: "#",
			icon: Newspaper,
			items: [
				{
					title: "All Articles",
					url: "/admin/blog/posts",
				},
				{
					title: "Categories",
					url: "/admin/blog/categories",
				},
				{
					title: "Authors",
					url: "/admin/blog/authors",
				},
			],
		},
		{
			title: "Products",
			url: "#",
			icon: Package,
			items: [
				{
					title: "All Products",
					url: "/admin/products",
				},
				{
					title: "Categories",
					url: "/admin/products/categories",
				},
				{
					title: "Options",
					url: "/admin/products/options",
				},
			],
		},
	],
	projects: [
		{
			name: "Design Engineering",
			url: "#",
			icon: Frame,
		},
		{
			name: "Sales & Marketing",
			url: "#",
			icon: PieChart,
		},
		{
			name: "Travel",
			url: "#",
			icon: LucideMap,
		},
	],
};
