import { Link } from "@tanstack/react-router";

import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const navItems: Array<{
	to: "/" | "/about" | "/blog" | "/shop" | "/shop/products" | "/contacts";
	label: string;
	exact?: true;
}> = [
	{ to: "/", label: "Home", exact: true },
	{ to: "/about", label: "About" },
	{ to: "/blog", label: "Blog" },
	{ to: "/shop", label: "Shop" },
	{ to: "/shop/products", label: "Products" },
	{ to: "/contacts", label: "Contacts" },
];

export const MainHeader = () => {
	return (
		<header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
			<div className="page-wrap flex h-14 items-center justify-between gap-4 px-4">
				<div className="flex min-w-0 flex-1 items-center gap-3">
					<Button
						variant="ghost"
						size="sm"
						className="shrink-0 font-semibold"
						asChild
					>
						<Link to="/">NextPressKit</Link>
					</Button>
					<Separator orientation="vertical" className="hidden h-6 sm:block" />
					<nav
						className="flex min-w-0 items-center gap-0.5 overflow-x-auto sm:gap-1"
						aria-label="Main navigation"
					>
						{navItems.map((item) => (
							<Button key={item.to} variant="ghost" size="sm" asChild>
								<Link
									to={item.to}
									{...(item.exact ? { activeOptions: { exact: true } } : {})}
									activeProps={{
										className: "bg-accent text-accent-foreground",
									}}
								>
									{item.label}
								</Link>
							</Button>
						))}
					</nav>
				</div>
				<div className="flex shrink-0 items-center">
					<ThemeToggle />
				</div>
			</div>
		</header>
	);
};
