import { Link } from "@tanstack/react-router";
import { Mail, Rss } from "lucide-react";

import { Button } from "#/components/ui/button";
import { Separator } from "#/components/ui/separator";

const navItems: Array<{
	to: "/" | "/about" | "/blog" | "/contacts";
	label: string;
	exact?: true;
}> = [
	{ to: "/", label: "Home", exact: true },
	{ to: "/about", label: "About" },
	{ to: "/blog", label: "Blog" },
	{ to: "/contacts", label: "Contacts" },
];

export const MainFooter = () => {
	const year = new Date().getFullYear();

	return (
		<footer className="mt-auto border-t bg-muted/30">
			<div className="page-wrap px-4 py-12">
				<div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
					<div className="space-y-3">
						<Button
							variant="ghost"
							size="sm"
							className="h-auto px-0 py-0 font-semibold text-base hover:bg-transparent"
							asChild
						>
							<Link to="/">NextPressKit</Link>
						</Button>
						<p className="max-w-xs text-sm text-muted-foreground leading-relaxed">
							A fast, modern publishing starter—write, ship, and grow your
							audience without the heavy lifting.
						</p>
					</div>
					<div className="space-y-3">
						<p className="text-sm font-semibold text-foreground">Quick links</p>
						<nav
							className="flex flex-col items-start gap-0.5"
							aria-label="Footer navigation"
						>
							{navItems.map((item) => (
								<Button
									key={item.to}
									variant="link"
									size="sm"
									className="h-8 px-0"
									asChild
								>
									<Link
										to={item.to}
										{...(item.exact ? { activeOptions: { exact: true } } : {})}
									>
										{item.label}
									</Link>
								</Button>
							))}
						</nav>
					</div>
					<div className="space-y-3">
						<p className="text-sm font-semibold text-foreground">Connect</p>
						<p className="text-sm text-muted-foreground">
							Follow the project and say hello—we read every note.
						</p>
						<div className="flex flex-wrap gap-2">
							<Button variant="outline" size="icon-sm" asChild>
								<a
									href="https://github.com"
									target="_blank"
									rel="noopener noreferrer"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										className="size-4"
										fill="currentColor"
										aria-hidden
									>
										<title>GitHub</title>
										<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
									</svg>
									<span className="sr-only">NextPressKit on GitHub</span>
								</a>
							</Button>
							<Button variant="outline" size="icon-sm" asChild>
								<a href="mailto:hello@example.com" aria-label="Email us">
									<Mail className="size-4" />
								</a>
							</Button>
						</div>
					</div>
					<div className="space-y-3">
						<p className="text-sm font-semibold text-foreground">Resources</p>
						<nav
							className="flex flex-col items-start gap-0.5"
							aria-label="Resources"
						>
							<Button
								variant="link"
								size="sm"
								className="h-8 px-0 gap-1.5"
								asChild
							>
								<Link to="/blog">
									<Rss className="size-3.5 shrink-0 opacity-70" aria-hidden />
									RSS / Blog feed
								</Link>
							</Button>
						</nav>
						<p className="text-xs text-muted-foreground leading-relaxed">
							New guides and release notes land here first.
						</p>
					</div>
				</div>
				<Separator className="my-8" />
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<p className="text-sm text-muted-foreground">
						© {year} NextPressKit. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
};
