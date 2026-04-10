import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import type { BlogCategoryListItem } from "@/features/admin/blog/schema";
import { useIsMobile } from "@/hooks/use-mobile";

function formatDetailDate(iso: string): string {
	try {
		return new Intl.DateTimeFormat("en-US", {
			dateStyle: "medium",
			timeStyle: "short",
		}).format(new Date(iso));
	} catch {
		return iso;
	}
}

export function TableCellViewer({
	item,
	children,
}: {
	item: BlogCategoryListItem;
	children?: ReactNode;
}) {
	const isMobile = useIsMobile();

	return (
		<Drawer direction={isMobile ? "bottom" : "right"} handleOnly>
			<DrawerTrigger asChild>
				{children ?? (
					<Button
						variant="link"
						className="w-fit px-0 text-left text-foreground"
					>
						{item.name}
					</Button>
				)}
			</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader className="gap-1">
					<DrawerTitle>{item.name}</DrawerTitle>
					<DrawerDescription className="font-mono text-xs">
						{item.slug}
					</DrawerDescription>
				</DrawerHeader>
				<div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
					{!isMobile && (
						<>
							<div className="grid gap-3 rounded-lg border bg-muted/30 p-4">
								<div className="flex justify-between gap-4 text-sm">
									<span className="text-muted-foreground">Posts</span>
									<span className="tabular-nums font-medium">
										{item.postCount}
									</span>
								</div>
								<div className="flex justify-between gap-4 text-sm">
									<span className="text-muted-foreground">Parent</span>
									<span className="text-right font-medium">
										{item.parentName ?? "—"}
									</span>
								</div>
								<div className="flex justify-between gap-4 text-sm">
									<span className="text-muted-foreground">Created</span>
									<span className="tabular-nums text-right">
										{formatDetailDate(item.createdAt)}
									</span>
								</div>
								<div className="flex justify-between gap-4 text-sm">
									<span className="text-muted-foreground">Updated</span>
									<span className="tabular-nums text-right">
										{formatDetailDate(item.updatedAt)}
									</span>
								</div>
							</div>
							<Separator />
						</>
					)}
					<form className="flex flex-col gap-4">
						<div className="flex flex-col gap-3">
							<Label htmlFor="category-name">Name</Label>
							<Input id="category-name" defaultValue={item.name} />
						</div>
						<div className="flex flex-col gap-3">
							<Label htmlFor="category-slug">Slug</Label>
							<Input
								id="category-slug"
								defaultValue={item.slug}
								className="font-mono"
							/>
						</div>
						<div className="flex flex-col gap-3">
							<Label htmlFor="category-description">Description</Label>
							<Textarea
								id="category-description"
								defaultValue={item.description ?? ""}
								rows={4}
							/>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div className="flex flex-col gap-3">
								<Label htmlFor="category-post-count">Posts</Label>
								<Input
									id="category-post-count"
									readOnly
									defaultValue={String(item.postCount)}
									className="tabular-nums"
								/>
							</div>
							<div className="flex flex-col gap-3">
								<Label htmlFor="category-parent">Parent</Label>
								<Input
									id="category-parent"
									readOnly
									defaultValue={item.parentName ?? "—"}
								/>
							</div>
						</div>
					</form>
				</div>
				<DrawerFooter>
					<Button>Submit</Button>
					<DrawerClose asChild>
						<Button variant="outline">Done</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}
