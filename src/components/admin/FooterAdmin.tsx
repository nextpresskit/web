import packageJson from "../../../package.json" with { type: "json" };

export const FooterAdmin = () => {
	const year = new Date().getFullYear();
	const version = packageJson.version ?? "0.0.0";

	return (
		<footer className="flex h-16 my-8 shrink-0 flex-col items-center justify-center gap-0.5 px-4 text-sm text-muted-foreground transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
			<p className="text-center">© {year} · Powered by NextPress</p>
			<p className="text-xs text-muted-foreground/80">Version {version}</p>
		</footer>
	);
};
