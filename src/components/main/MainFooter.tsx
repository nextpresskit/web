import { Link } from "@tanstack/react-router";
import { ArrowUp, Github, Mail, Rss } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

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
							<Link to="/">NextPress</Link>
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
									aria-label="NextPress on GitHub"
								>
									<Github className="size-4" />
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
						© {year} NextPress. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
};
