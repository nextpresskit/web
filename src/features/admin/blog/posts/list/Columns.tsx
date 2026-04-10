import { Link } from "@tanstack/react-router";
import type { Column, ColumnDef } from "@tanstack/react-table";
import {
	ArrowDown,
	ArrowDownUp,
	ArrowUp,
	MoreVertical,
	PanelRightOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { BlogPosts } from "@/features/admin/blog/schema";
import { TableCellViewer } from "./TableCellViewer";

/** Status labels used across `blog_posts_list.json` */
export const BLOG_POST_STATUSES = [
	"Draft",
	"In review",
	"Scheduled",
	"Published",
	"Archived",
] as const;

type CreateColumnsOptions = {
	onStatusChange: (postId: number, status: string) => void;
};

function formatTableDate(iso: string | null): string {
	if (!iso) return "—";
	try {
		return new Intl.DateTimeFormat("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		}).format(new Date(iso));
	} catch {
		return "—";
	}
}

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

export function createColumns({
	onStatusChange,
}: CreateColumnsOptions): ColumnDef<BlogPosts>[] {
	return [
		{
			id: "select",
			header: ({ table }) => (
				<div className="flex items-center justify-center px-4">
					<Checkbox
						checked={
							table.getIsAllPageRowsSelected() ||
							(table.getIsSomePageRowsSelected() && "indeterminate")
						}
						onCheckedChange={(value) =>
							table.toggleAllPageRowsSelected(!!value)
						}
						aria-label="Select all"
					/>
				</div>
			),
			cell: ({ row }) => (
				<div className="flex items-center justify-center">
					<Checkbox
						checked={row.getIsSelected()}
						onCheckedChange={(value) => row.toggleSelected(!!value)}
						aria-label="Select row"
					/>
				</div>
			),
			enableSorting: false,
			enableHiding: false,
		},
		{
			accessorKey: "id",
			header: ({ column }) => (
				<SortableColumnHeader column={column} title="Id" />
			),
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
				<div className="flex w-fit max-w-[min(500px,50vw)] min-w-0 items-center gap-1">
					<Link
						to="/admin/blog/posts/$postId"
						params={{ postId: String(row.original.id) }}
						className="min-w-0 truncate font-medium text-foreground hover:underline"
						title={row.original.title}
					>
						{row.original.title}
					</Link>
					<TableCellViewer item={row.original}>
						<Button
							variant="ghost"
							size="icon"
							className="size-7 shrink-0 text-muted-foreground hover:text-foreground"
							aria-label={`View details: ${row.original.title}`}
						>
							<PanelRightOpen className="size-4" />
							<span className="sr-only">Open details</span>
						</Button>
					</TableCellViewer>
				</div>
			),
			enableHiding: false,
		},
		{
			id: "author",
			accessorFn: (row) => row.author.displayName,
			header: ({ column }) => (
				<SortableColumnHeader column={column} title="Author" />
			),
			cell: ({ row }) => (
				<span className="text-muted-foreground">
					{row.original.author.displayName}
				</span>
			),
		},
		{
			accessorKey: "reviewer",
			header: ({ column }) => (
				<SortableColumnHeader column={column} title="Reviewer" />
			),
			cell: ({ row }) => (
				<span className="text-muted-foreground">{row.original.reviewer}</span>
			),
		},
		{
			accessorKey: "status",
			header: ({ column }) => (
				<SortableColumnHeader column={column} title="Status" />
			),
			cell: ({ row }) => (
				<Select
					value={row.original.status}
					onValueChange={(value) => onStatusChange(row.original.id, value)}
				>
					<SelectTrigger
						size="sm"
						className="w-[148px] **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
						aria-label={`Status for ${row.original.title}`}
					>
						<SelectValue />
					</SelectTrigger>
					<SelectContent align="end" position="popper">
						{BLOG_POST_STATUSES.map((status) => (
							<SelectItem key={status} value={status}>
								{status}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			),
		},
		{
			id: "categories",
			accessorFn: (row) => row.categories.map((c) => c.name).join(", "),
			header: ({ column }) => (
				<SortableColumnHeader column={column} title="Categories" />
			),
			cell: ({ row }) => (
				<div
					className="max-w-[min(220px,28vw)] truncate text-muted-foreground"
					title={row.original.categories.map((c) => c.name).join(", ")}
				>
					{row.original.categories.map((c) => c.name).join(", ")}
				</div>
			),
		},
		{
			accessorKey: "createdAt",
			header: ({ column }) => (
				<SortableColumnHeader column={column} title="Created" />
			),
			sortingFn: "datetime",
			cell: ({ row }) => (
				<span className="whitespace-nowrap text-muted-foreground tabular-nums">
					{formatTableDate(row.original.createdAt)}
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
					{formatTableDate(row.original.publishedAt)}
				</span>
			),
		},
		{
			id: "actions",
			header: "",
			enableSorting: false,
			cell: ({ row }) => (
				<DropdownMenu modal={false}>
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							className="flex size-8 text-muted-foreground data-[state=open]:bg-muted"
							size="icon"
						>
							<MoreVertical />
							<span className="sr-only">Open menu</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-40">
						<DropdownMenuItem>Edit</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<a
								href={`/blog/${row.original.slug}`}
								target="_blank"
								rel="noopener noreferrer"
							>
								View article
							</a>
						</DropdownMenuItem>
						<DropdownMenuItem>Make a copy</DropdownMenuItem>
						<DropdownMenuItem>Favorite</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			),
		},
	];
}
