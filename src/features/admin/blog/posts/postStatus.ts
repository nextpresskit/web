import type { AdminPostStatus } from "#/@types/admin";

/** Statuses the backend accepts for posts (docs/openapi.yaml). */
export const ADMIN_POST_STATUSES = [
	"draft",
	"published",
	"archived",
] as const satisfies readonly AdminPostStatus[];

const LABELS: Record<AdminPostStatus, string> = {
	draft: "Draft",
	published: "Published",
	archived: "Archived",
};

export function isAdminPostStatus(value: string): value is AdminPostStatus {
	return (ADMIN_POST_STATUSES as readonly string[]).includes(value);
}

export function postStatusLabel(status: string): string {
	if (isAdminPostStatus(status)) return LABELS[status];
	return status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown";
}

export function postStatusBadgeVariant(
	status: string,
): "default" | "secondary" | "outline" {
	if (status === "published") return "default";
	if (status === "draft") return "secondary";
	return "outline";
}
