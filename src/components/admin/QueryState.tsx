import { AlertCircle, Inbox, type LucideIcon, RotateCw } from "lucide-react";
import type { ReactNode } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getApiErrorMessage } from "@/lib/axios/clientAxios";

/** Page heading shared by admin list screens. */
export function AdminPageHeader({
	title,
	description,
	actions,
}: {
	title: string;
	description?: string;
	actions?: ReactNode;
}) {
	return (
		<header className="flex flex-col gap-3 px-4 sm:flex-row sm:items-end sm:justify-between lg:px-6">
			<div className="space-y-1">
				<h1 className="font-semibold text-2xl tracking-tight">{title}</h1>
				{description ? (
					<p className="text-muted-foreground text-sm">{description}</p>
				) : null}
			</div>
			{actions ? (
				<div className="flex items-center gap-2">{actions}</div>
			) : null}
		</header>
	);
}

export function LoadingState({
	label = "Loading…",
	rows = 5,
}: {
	label?: string;
	rows?: number;
}) {
	const keys = Array.from({ length: rows }, (_, i) => `row-${i}`);
	return (
		<div className="space-y-3 px-4 lg:px-6" aria-busy="true">
			<output className="sr-only">{label}</output>
			{keys.map((key) => (
				<Skeleton key={key} className="h-10 w-full" />
			))}
		</div>
	);
}

export function ErrorState({
	title = "Could not load data",
	error,
	onRetry,
}: {
	title?: string;
	error: unknown;
	onRetry?: (() => void) | undefined;
}) {
	return (
		<div className="px-4 lg:px-6">
			<Alert variant="destructive">
				<AlertCircle />
				<AlertTitle>{title}</AlertTitle>
				<AlertDescription>
					<p>{getApiErrorMessage(error)}</p>
					{onRetry ? (
						<Button
							type="button"
							variant="outline"
							size="sm"
							className="mt-2"
							onClick={onRetry}
						>
							<RotateCw aria-hidden />
							Try again
						</Button>
					) : null}
				</AlertDescription>
			</Alert>
		</div>
	);
}

export function EmptyState({
	title,
	description,
	icon: Icon = Inbox,
	children,
}: {
	title: string;
	description: ReactNode;
	icon?: LucideIcon;
	children?: ReactNode;
}) {
	return (
		<div className="px-4 lg:px-6">
			<div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed px-6 py-12 text-center">
				<div className="flex size-12 items-center justify-center rounded-full bg-muted">
					<Icon className="size-6 text-muted-foreground" aria-hidden />
				</div>
				<h2 className="font-semibold text-lg">{title}</h2>
				<div className="max-w-md text-muted-foreground text-sm">
					{description}
				</div>
				{children}
			</div>
		</div>
	);
}
