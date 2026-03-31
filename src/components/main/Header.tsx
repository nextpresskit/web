import { ThemeToggle } from "../ThemeToggle";

export default function Header() {
	return (
		<div className="flex items-center justify-between border-b p-4">
			<ThemeToggle />
		</div>
	);
}
