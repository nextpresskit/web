import { ClientOnly } from "@tanstack/react-router";
import type { MDEditorProps } from "@uiw/react-md-editor";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type BlogPostMarkdownEditorProps = {
	id: string;
	label: string;
	value: string;
	onChange: (next: string) => void;
};

export function BlogPostMarkdownEditor({
	id,
	label,
	value,
	onChange,
}: BlogPostMarkdownEditorProps) {
	const { resolvedTheme } = useTheme();
	const [Editor, setEditor] =
		useState<React.ComponentType<MDEditorProps> | null>(null);

	useEffect(() => {
		void Promise.all([
			import("@uiw/react-md-editor"),
			import("@uiw/react-md-editor/markdown-editor.css"),
		]).then(([mod]) => {
			setEditor(() => mod.default);
		});
	}, []);

	const colorMode = resolvedTheme === "dark" ? "dark" : "light";

	return (
		<div className="grid gap-2">
			<Label htmlFor={id}>{label}</Label>
			<ClientOnly
				fallback={
					<Textarea
						id={id}
						value={value}
						onChange={(e) => onChange(e.target.value)}
						className="font-mono min-h-[320px]"
					/>
				}
			>
				{Editor ? (
					<div data-color-mode={colorMode}>
						<Editor
							value={value}
							onChange={(v) => onChange(v ?? "")}
							height={320}
							textareaProps={{ id }}
						/>
					</div>
				) : (
					<Textarea
						id={id}
						value={value}
						onChange={(e) => onChange(e.target.value)}
						className="font-mono min-h-[320px]"
					/>
				)}
			</ClientOnly>
		</div>
	);
}
