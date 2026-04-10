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
import type { BlogAuthorListItem } from "@/features/admin/blog/schema";
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
	item: BlogAuthorListItem;
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
						{item.displayName}
					</Button>
				)}
			</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader className="gap-1">
					<DrawerTitle>{item.displayName}</DrawerTitle>
					<DrawerDescription className="font-mono text-xs">
						{item.id}
					</DrawerDescription>
				</DrawerHeader>
				<div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
					{!isMobile && (
						<>
							<div className="grid gap-3 rounded-lg border bg-muted/30 p-4">
								<div className="flex justify-between gap-4 text-sm">
									<span className="text-muted-foreground">Email</span>
									<span className="text-right font-medium">{item.email}</span>
								</div>
								<div className="flex justify-between gap-4 text-sm">
									<span className="text-muted-foreground">Role</span>
									<span className="text-right font-medium">{item.role}</span>
								</div>
								<div className="flex justify-between gap-4 text-sm">
									<span className="text-muted-foreground">Status</span>
									<span className="text-right font-medium">{item.status}</span>
								</div>
								<div className="flex justify-between gap-4 text-sm">
									<span className="text-muted-foreground">Posts</span>
									<span className="tabular-nums font-medium">
										{item.postCount}
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
							<Label htmlFor="author-display-name">Display name</Label>
							<Input
								id="author-display-name"
								defaultValue={item.displayName}
							/>
						</div>
						<div className="flex flex-col gap-3">
							<Label htmlFor="author-email">Email</Label>
							<Input id="author-email" type="email" defaultValue={item.email} />
						</div>
						<div className="flex flex-col gap-3">
							<Label htmlFor="author-role">Role</Label>
							<Input id="author-role" defaultValue={item.role} />
						</div>
						<div className="flex flex-col gap-3">
							<Label htmlFor="author-bio">Bio</Label>
							<Textarea id="author-bio" defaultValue={item.bio} rows={4} />
						</div>
					</form>
				</div>
				<DrawerFooter>
					<Button>Save</Button>
					<DrawerClose asChild>
						<Button variant="outline">Done</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}
