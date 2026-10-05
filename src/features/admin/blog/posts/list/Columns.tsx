import { Link } from "@tanstack/react-router";
import type { Column, ColumnDef } from "@tanstack/react-table";
import { ArrowDown, ArrowDownUp, ArrowUp, PanelRightOpen } from "lucide-react";
import type { AdminPost } from "#/@types/admin";
import { formatAdminDate } from "#/components/admin/ListControls";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import {
	postStatusBadgeVariant,
	postStatusLabel,
} from "#/features/admin/blog/posts/postStatus";
import { TableCellViewer } from "./TableCellViewer";

function SortableColumnHeader<TData, TValue>({
	column,
	title,
}: {
	column: Column<TData, TValue>;
	title: string;
}) {
	const sorted = column.getIsSorted();
	const SortIcon =
		sorted === "asc" ? ArrowUp : sorted === "desc" ? ArrowDown : ArrowDownUp;

	return (
		<Button
			variant="ghost"
			className="-ml-2 h-8 px-2 font-medium"
			onClick={() => column.toggleSorting(sorted === "asc")}
		>
			{title}
			<SortIcon
				className={`ml-1 size-4 shrink-0 ${sorted ? "text-foreground opacity-100" : "opacity-60"}`}
				aria-hidden
			/>
		</Button>
	);
}

export const postColumns: ColumnDef<AdminPost>[] = [
	{
		accessorKey: "id",
		header: ({ column }) => <SortableColumnHeader column={column} title="Id" />,
		sortingFn: "basic",
		cell: ({ row }) => (
			<span className="tabular-nums text-muted-foreground">
				{row.original.id}
			</span>
		),
	},
	{
		accessorKey: "title",
		header: ({ column }) => (
			<SortableColumnHeader column={column} title="Title" />
		),
		cell: ({ row }) => (
			<div className="flex w-fit max-w-[min(460px,60vw)] min-w-0 items-center gap-1">
				<div className="min-w-0">
					<Link
						to="/admin/blog/posts/$postId"
						params={{ postId: String(row.original.id) }}
						className="block truncate font-medium text-foreground hover:underline"
						title={row.original.title}
					>
						{row.original.title}
					</Link>
					<span className="block truncate text-muted-foreground text-xs">
						/{row.original.slug}
					</span>
				</div>
				<TableCellViewer item={row.original}>
					<Button
						variant="ghost"
						size="icon"
						className="size-7 shrink-0 text-muted-foreground hover:text-foreground"
					>
						<PanelRightOpen className="size-4" aria-hidden />
						<span className="sr-only">Details for {row.original.title}</span>
					</Button>
				</TableCellViewer>
			</div>
		),
		enableHiding: false,
	},
	{
		id: "author",
		accessorFn: (row) => row.author?.name ?? "",
		header: ({ column }) => (
			<SortableColumnHeader column={column} title="Author" />
		),
		cell: ({ row }) => (
			<span className="whitespace-nowrap text-muted-foreground">
				{row.original.author?.name ?? "—"}
			</span>
		),
	},
	{
		accessorKey: "status",
		header: ({ column }) => (
			<SortableColumnHeader column={column} title="Status" />
		),
		cell: ({ row }) => (
			<Badge variant={postStatusBadgeVariant(row.original.status)}>
				{postStatusLabel(row.original.status)}
			</Badge>
		),
	},
	{
		id: "categories",
		accessorFn: (row) => row.categories.map((c) => c.name).join(", "),
		header: ({ column }) => (
			<SortableColumnHeader column={column} title="Categories" />
		),
		cell: ({ row }) => {
			const names = row.original.categories.map((c) => c.name).join(", ");
			return (
				<div
					className="max-w-[min(220px,28vw)] truncate text-muted-foreground"
					title={names}
				>
					{names || "—"}
				</div>
			);
		},
	},
	{
		accessorKey: "createdAt",
		header: ({ column }) => (
			<SortableColumnHeader column={column} title="Created" />
		),
		sortingFn: "datetime",
		cell: ({ row }) => (
			<span className="whitespace-nowrap text-muted-foreground tabular-nums">
				{formatAdminDate(row.original.createdAt)}
			</span>
		),
	},
	{
		accessorKey: "publishedAt",
		header: ({ column }) => (
			<SortableColumnHeader column={column} title="Published" />
		),
		sortingFn: "datetime",
		sortUndefined: "last",
		cell: ({ row }) => (
			<span className="whitespace-nowrap text-muted-foreground tabular-nums">
				{formatAdminDate(row.original.publishedAt)}
			</span>
		),
	},
];
