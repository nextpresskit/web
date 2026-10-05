import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";

/** Search field that reports its value after the user stops typing. */
export function ListSearch({
	value,
	onSearch,
	placeholder,
	label,
	delayMs = 300,
}: {
	value: string;
	onSearch: (value: string) => void;
	placeholder: string;
	label: string;
	delayMs?: number;
}) {
	const id = useId();
	const [draft, setDraft] = useState(value);

	useEffect(() => {
		setDraft(value);
	}, [value]);

	useEffect(() => {
		if (draft === value) return;
		const timer = setTimeout(() => onSearch(draft), delayMs);
		return () => clearTimeout(timer);
	}, [draft, value, onSearch, delayMs]);

	return (
		<div className="relative w-full sm:max-w-xs">
			<label htmlFor={id} className="sr-only">
				{label}
			</label>
			<Search
				className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
				aria-hidden
			/>
			<Input
				id={id}
				type="search"
				value={draft}
				onChange={(event) => setDraft(event.target.value)}
				placeholder={placeholder}
				className="pl-8"
			/>
		</div>
	);
}

/** Previous/next pager for server-paginated admin lists. */
export function PaginationBar({
	page,
	pageSize,
	itemCount,
	total,
	hasNextPage,
	isFetching,
	onPageChange,
	noun,
}: {
	page: number;
	pageSize: number;
	itemCount: number;
	total: number | null;
	hasNextPage: boolean;
	isFetching?: boolean;
	onPageChange: (page: number) => void;
	noun: string;
}) {
	const first = itemCount === 0 ? 0 : (page - 1) * pageSize + 1;
	const last = (page - 1) * pageSize + itemCount;
	const pageCount =
		total === null ? null : Math.max(1, Math.ceil(total / pageSize));

	return (
		<nav
			aria-label={`${noun} pages`}
			className="flex flex-col gap-3 px-4 sm:flex-row sm:items-center sm:justify-between lg:px-6"
		>
			<p className="text-muted-foreground text-sm" aria-live="polite">
				{itemCount === 0
					? `No ${noun}`
					: total === null
						? `Showing ${first}–${last}`
						: `Showing ${first}–${last} of ${total.toLocaleString()} ${noun}`}
				{isFetching ? " · Updating…" : null}
			</p>
			<div className="flex items-center gap-2">
				<span className="text-sm tabular-nums">
					Page {page}
					{pageCount === null ? null : ` of ${pageCount}`}
				</span>
				<Button
					type="button"
					variant="outline"
					size="icon"
					className="size-8"
					onClick={() => onPageChange(page - 1)}
					disabled={page <= 1}
				>
					<ChevronLeft aria-hidden />
					<span className="sr-only">Previous page</span>
				</Button>
				<Button
					type="button"
					variant="outline"
					size="icon"
					className="size-8"
					onClick={() => onPageChange(page + 1)}
					disabled={!hasNextPage}
				>
					<ChevronRight aria-hidden />
					<span className="sr-only">Next page</span>
				</Button>
			</div>
		</nav>
	);
}

/** "Oct 5, 2026" or an em dash for missing dates. */
export function formatAdminDate(iso: string | null | undefined): string {
	if (!iso) return "—";
	const date = new Date(iso);
	if (Number.isNaN(date.getTime())) return "—";
	return new Intl.DateTimeFormat("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	}).format(date);
}
