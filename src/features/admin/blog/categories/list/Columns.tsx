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
import type { BlogCategoryListItem } from "@/features/admin/blog/schema";
import { TableCellViewer } from "./TableCellViewer";

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

type CreateColumnsOptions = {
	categoryEditTo: "/admin/blog/categories/$categoryId";
};

export function createColumns({
	categoryEditTo,
}: CreateColumnsOptions): ColumnDef<BlogCategoryListItem>[] {
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
			accessorKey: "name",
			header: ({ column }) => (
				<SortableColumnHeader column={column} title="Name" />
			),
			cell: ({ row }) => (
				<div className="flex w-fit max-w-[min(500px,50vw)] min-w-0 items-center gap-1">
					<Link
						to={categoryEditTo}
						params={{ categoryId: String(row.original.id) }}
						className="min-w-0 truncate font-medium text-foreground hover:underline"
						title={row.original.name}
					>
						{row.original.name}
					</Link>
					<TableCellViewer item={row.original}>
						<Button
							variant="ghost"
							size="icon"
							className="size-7 shrink-0 text-muted-foreground hover:text-foreground"
							aria-label={`View details: ${row.original.name}`}
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
			accessorKey: "slug",
			header: ({ column }) => (
				<SortableColumnHeader column={column} title="Slug" />
			),
			cell: ({ row }) => (
				<span
					className="block max-w-[min(220px,30vw)] truncate font-mono text-sm text-muted-foreground"
					title={row.original.slug}
				>
					{row.original.slug}
				</span>
			),
		},
		{
			id: "description",
			accessorFn: (row) => row.description ?? "",
			header: ({ column }) => (
				<SortableColumnHeader column={column} title="Description" />
			),
			cell: ({ row }) => {
				const text = row.original.description;
				return (
					<div
						className="max-w-[min(280px,32vw)] truncate text-muted-foreground"
						title={text ?? undefined}
					>
						{text ?? "—"}
					</div>
				);
			},
		},
		{
			accessorKey: "postCount",
			header: ({ column }) => (
				<SortableColumnHeader column={column} title="Posts" />
			),
			sortingFn: "basic",
			cell: ({ row }) => (
				<span className="tabular-nums text-muted-foreground">
					{row.original.postCount}
				</span>
			),
		},
		{
			id: "parentName",
			accessorFn: (row) => row.parentName ?? "",
			header: ({ column }) => (
				<SortableColumnHeader column={column} title="Parent" />
			),
			cell: ({ row }) => (
				<span className="text-muted-foreground">
					{row.original.parentName ?? "—"}
				</span>
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
			accessorKey: "updatedAt",
			header: ({ column }) => (
				<SortableColumnHeader column={column} title="Updated" />
			),
			sortingFn: "datetime",
			cell: ({ row }) => (
				<span className="whitespace-nowrap text-muted-foreground tabular-nums">
					{formatTableDate(row.original.updatedAt)}
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
						<DropdownMenuItem asChild>
							<Link
								to={categoryEditTo}
								params={{ categoryId: String(row.original.id) }}
							>
								Edit
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<a
								href={`/blog/category/${row.original.slug}`}
								target="_blank"
								rel="noopener noreferrer"
							>
								View archive
							</a>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			),
		},
	];
}
