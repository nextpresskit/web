import {
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	type SortingState,
	useReactTable,
	type VisibilityState,
} from "@tanstack/react-table";
import { ChevronDown, Columns2 } from "lucide-react";
import * as React from "react";
import type { AdminPost } from "#/@types/admin";
import { Button } from "#/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "#/components/ui/table";
import { useIsMobile } from "#/hooks/use-mobile";
import { postColumns } from "./Columns";

/** Narrow screens show title and status; other columns stay one tap away in "Columns". */
const MOBILE_HIDDEN: VisibilityState = {
	id: false,
	author: false,
	categories: false,
	createdAt: false,
	publishedAt: false,
};

/** One server page of posts; sorting applies within the page. */
export function PostsTableAdmin({
	posts,
	toolbar,
}: {
	posts: AdminPost[];
	toolbar?: React.ReactNode;
}) {
	const isMobile = useIsMobile();
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	React.useEffect(() => {
		setColumnVisibility(isMobile ? MOBILE_HIDDEN : {});
	}, [isMobile]);
	const [sorting, setSorting] = React.useState<SortingState>([]);

	const table = useReactTable({
		data: posts,
		columns: postColumns,
		state: { sorting, columnVisibility },
		getRowId: (row) => row.id.toString(),
		onSortingChange: setSorting,
		onColumnVisibilityChange: setColumnVisibility,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
	});

	return (
		<div className="flex min-w-0 w-full max-w-full flex-col gap-4">
			<div className="flex flex-col gap-3 px-4 sm:flex-row sm:items-center sm:justify-between lg:px-6">
				<div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
					{toolbar}
				</div>
				<DropdownMenu modal={false}>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" size="sm" className="self-start">
							<Columns2 aria-hidden />
							<span>Columns</span>
							<ChevronDown aria-hidden />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-56">
						{table
							.getAllColumns()
							.filter(
								(column) =>
									typeof column.accessorFn !== "undefined" &&
									column.getCanHide(),
							)
							.map((column) => (
								<DropdownMenuCheckboxItem
									key={column.id}
									className="capitalize"
									checked={column.getIsVisible()}
									onCheckedChange={(value) => column.toggleVisibility(!!value)}
								>
									{column.id}
								</DropdownMenuCheckboxItem>
							))}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			<div className="min-w-0 overflow-x-auto border-y">
				<Table className="min-w-max">
					<TableHeader className="sticky top-0 z-10 bg-muted">
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead
										key={header.id}
										colSpan={header.colSpan}
										className="first:pl-4 lg:first:pl-6"
									>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext(),
												)}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow key={row.id}>
									{row.getVisibleCells().map((cell) => (
										<TableCell
											key={cell.id}
											className="first:pl-4 lg:first:pl-6"
										>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={table.getAllColumns().length}
									className="h-24 text-center text-muted-foreground"
								>
									No posts match these filters.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
