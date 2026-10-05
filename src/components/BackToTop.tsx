import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "#/lib/utils";

import { Button } from "./ui/button";

const SCROLL_THRESHOLD_PX = 320;

export const BackToTop = () => {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const onScroll = () => {
			setVisible(window.scrollY > SCROLL_THRESHOLD_PX);
		};

		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	return (
		<div
			className={cn(
				"fixed bottom-4 right-4 z-50 transition-[opacity,transform] duration-300 ease-out",
				visible ? "opacity-100" : "pointer-events-none opacity-0",
			)}
			aria-hidden={!visible}
		>
			<Button
				variant="outline"
				size="icon"
				tabIndex={visible ? 0 : -1}
				onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
				aria-label="Back to top"
			>
				<ArrowUp className="size-4" />
			</Button>
		</div>
	);
};
