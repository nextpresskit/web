import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import type { AdminPost } from "#/@types/admin";
import { formatAdminDate } from "#/components/admin/ListControls";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "#/components/ui/drawer";
import { Separator } from "#/components/ui/separator";
import {
	postStatusBadgeVariant,
	postStatusLabel,
} from "#/features/admin/blog/posts/postStatus";
import { useIsMobile } from "#/hooks/use-mobile";

function DetailRow({
	label,
	children,
}: {
	label: string;
	children: ReactNode;
}) {
	return (
		<div className="grid grid-cols-[8rem_1fr] gap-3">
			<dt className="text-muted-foreground">{label}</dt>
			<dd className="min-w-0 break-words">{children}</dd>
		</div>
	);
}

/** Read-only summary of a post, opened from the posts table. */
export function TableCellViewer({
	item,
	children,
}: {
	item: AdminPost;
	children?: ReactNode;
}) {
	const isMobile = useIsMobile();

	return (
		<Drawer direction={isMobile ? "bottom" : "right"}>
			<DrawerTrigger asChild>
				{children ?? (
					<Button
						variant="link"
						className="w-fit px-0 text-left text-foreground"
					>
						{item.title}
					</Button>
				)}
			</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader className="gap-2">
					<div className="flex items-center gap-2">
						<Badge variant={postStatusBadgeVariant(item.status)}>
							{postStatusLabel(item.status)}
						</Badge>
						<span className="text-muted-foreground text-xs">
							#{item.id} · {item.type}
						</span>
					</div>
					<DrawerTitle>{item.title}</DrawerTitle>
					<DrawerDescription>
						{item.excerpt || item.subtitle || "No excerpt yet."}
					</DrawerDescription>
				</DrawerHeader>
				<div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
					<dl className="flex flex-col gap-2">
						<DetailRow label="Slug">/{item.slug}</DetailRow>
						<DetailRow label="Author">{item.author?.name ?? "—"}</DetailRow>
						<DetailRow label="Visibility">{item.visibility}</DetailRow>
						<DetailRow label="Locale">{item.locale || "—"}</DetailRow>
						<DetailRow label="Created">
							{formatAdminDate(item.createdAt)}
						</DetailRow>
						<DetailRow label="Published">
							{formatAdminDate(item.publishedAt)}
						</DetailRow>
						{item.scheduledPublishAt && !item.publishedAt ? (
							<DetailRow label="Scheduled">
								{formatAdminDate(item.scheduledPublishAt)}
							</DetailRow>
						) : null}
					</dl>
					<Separator />
					<div className="flex flex-col gap-2">
						<span className="text-muted-foreground">Categories</span>
						<div className="flex flex-wrap gap-1">
							{item.categories.length
								? item.categories.map((category) => (
										<Badge key={category.id} variant="outline">
											{category.name}
										</Badge>
									))
								: "—"}
						</div>
						<span className="text-muted-foreground">Tags</span>
						<div className="flex flex-wrap gap-1">
							{item.tags.length
								? item.tags.map((tag) => (
										<Badge key={tag.id} variant="secondary">
											{tag.name}
										</Badge>
									))
								: "—"}
						</div>
					</div>
				</div>
				<DrawerFooter>
					<Button asChild>
						<Link
							to="/admin/blog/posts/$postId"
							params={{ postId: String(item.id) }}
						>
							Edit post
						</Link>
					</Button>
					<DrawerClose asChild>
						<Button variant="outline">Close</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}
