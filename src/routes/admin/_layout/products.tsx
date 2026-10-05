import { createFileRoute, Link } from "@tanstack/react-router";
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	type PaginationState,
	type SortingState,
	useReactTable,
} from "@tanstack/react-table";
import {
	ArrowDownUp,
	ChevronLeft,
	ChevronRight,
	ExternalLink,
	MoreHorizontal,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
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
import { formatProductPrice, PRODUCTS, type Product } from "#/helpers/products";

export const Route = createFileRoute("/admin/_layout/products")({
	component: RouteComponent,
});

const DEFAULT_PAGE_SIZE = 10;

const columnHelper = createColumnHelper<Product>();

function ProductActionsMenu({ product }: { product: Product }) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					className="size-8"
					aria-label={`Actions for ${product.name}`}
				>
					<MoreHorizontal className="size-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-48">
				<DropdownMenuLabel>Actions</DropdownMenuLabel>
				<DropdownMenuItem asChild>
					<Link
						to="/shop/$productId"
						params={{ productId: product.slug }}
						target="_blank"
						rel="noopener noreferrer"
						className="flex cursor-pointer items-center gap-2"
					>
						<ExternalLink className="size-4" />
						View storefront
					</Link>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					onSelect={() =>
						toast.message("Edit product", {
							description: `Open editor for “${product.name}” (not wired yet).`,
						})
					}
				>
					Edit…
				</DropdownMenuItem>
				<DropdownMenuItem
					onSelect={() =>
						toast.success("Duplicate queued", {
							description: `${product.sku} would be copied in a real admin.`,
						})
					}
				>
					Duplicate
				</DropdownMenuItem>
				<DropdownMenuItem
					variant="destructive"
					onSelect={() =>
						toast.error("Delete blocked", {
							description: `“${product.name}” is sample data; delete is disabled.`,
						})
					}
				>
					Delete
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

function RouteComponent() {
	const [sorting, setSorting] = useState<SortingState>([
		{ id: "name", desc: false },
	]);
	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: DEFAULT_PAGE_SIZE,
	});

	const columns = useMemo(
		() => [
			columnHelper.accessor("name", {
				header: ({ column }) => (
					<Button
						variant="ghost"
						className="-ml-2 h-8 px-2 font-medium"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Product
						<ArrowDownUp className="size-4 opacity-60" />
					</Button>
				),
				cell: ({ row }) => (
					<div className="max-w-[220px]">
						<div className="truncate font-medium">{row.original.name}</div>
						<div className="truncate text-muted-foreground text-xs">
							{row.original.shortDescription}
						</div>
					</div>
				),
			}),
			columnHelper.accessor("sku", {
				header: "SKU",
				cell: ({ getValue }) => (
					<span className="font-mono text-xs">{getValue()}</span>
				),
			}),
			columnHelper.accessor("category", {
				header: "Category",
				cell: ({ getValue }) => <Badge variant="secondary">{getValue()}</Badge>,
			}),
			columnHelper.accessor("price", {
				header: ({ column }) => (
					<Button
						variant="ghost"
						className="-ml-2 h-8 px-2 font-medium"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Price
						<ArrowDownUp className="size-4 opacity-60" />
					</Button>
				),
				cell: ({ row }) =>
					formatProductPrice(row.original.price, row.original.currency),
				sortingFn: "basic",
			}),
			columnHelper.accessor("stockQuantity", {
				header: "Stock",
				cell: ({ row }) => {
					const qty = row.original.stockQuantity;
					const low = row.original.lowStockThreshold;
					const warn = qty <= low;
					return (
						<span
							className={
								warn
									? "font-medium text-amber-600 dark:text-amber-400"
									: undefined
							}
						>
							{qty.toLocaleString("en-US")}
							{warn ? " (low)" : ""}
						</span>
					);
				},
			}),
			columnHelper.accessor("inStock", {
				header: "Status",
				cell: ({ getValue }) =>
					getValue() ? (
						<Badge>In stock</Badge>
					) : (
						<Badge variant="outline">Out of stock</Badge>
					),
			}),
			columnHelper.display({
				id: "actions",
				header: "",
				cell: ({ row }) => <ProductActionsMenu product={row.original} />,
			}),
		],
		[],
	);

	const table = useReactTable({
		data: PRODUCTS,
		columns,
		state: { sorting, pagination },
		onSortingChange: setSorting,
		onPaginationChange: setPagination,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	});

	const { pageIndex, pageSize } = table.getState().pagination;
	const sortedRowCount = table.getSortedRowModel().rows.length;
	const pageCount = table.getPageCount();
	const fromRow = sortedRowCount === 0 ? 0 : pageIndex * pageSize + 1;
	const toRow = Math.min((pageIndex + 1) * pageSize, sortedRowCount);

	return (
		<div className="w-full space-y-8 px-4 py-8 md:px-8">
			<header className="space-y-1">
				<h1 className="text-2xl font-semibold tracking-tight">Products</h1>
				<p className="text-muted-foreground text-sm">
					Manage catalog items, inventory, and storefront actions.
				</p>
			</header>

			<div className="rounded-lg border bg-card">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((hg) => (
							<TableRow key={hg.id} className="hover:bg-transparent">
								{hg.headers.map((header) => (
									<TableHead key={header.id} className="whitespace-nowrap">
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
										<TableCell key={cell.id}>
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
									colSpan={columns.length}
									className="h-24 text-center text-muted-foreground"
								>
									No products found.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
				<div className="flex flex-col gap-3 border-t px-3 py-3 sm:flex-row sm:items-center sm:justify-between">
					<p className="text-muted-foreground text-sm tabular-nums">
						Showing{" "}
						<span className="font-medium text-foreground">
							{fromRow}–{toRow}
						</span>{" "}
						of{" "}
						<span className="font-medium text-foreground">
							{sortedRowCount}
						</span>
						{sortedRowCount > 0 ? (
							<span className="text-muted-foreground">
								{" "}
								· Page {pageIndex + 1} of {pageCount}
							</span>
						) : null}
					</p>
					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							size="sm"
							className="gap-1"
							onClick={() => table.previousPage()}
							disabled={!table.getCanPreviousPage()}
						>
							<ChevronLeft className="size-4" />
							Previous
						</Button>
						<Button
							variant="outline"
							size="sm"
							className="gap-1"
							onClick={() => table.nextPage()}
							disabled={!table.getCanNextPage()}
						>
							Next
							<ChevronRight className="size-4" />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
