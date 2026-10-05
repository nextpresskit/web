import { createFileRoute } from "@tanstack/react-router";
import { Users } from "lucide-react";
import { AdminPageHeader, EmptyState } from "@/components/admin/QueryState";

export const Route = createFileRoute("/admin/_layout/users")({
	component: RouteComponent,
});

/**
 * The backend has no user listing endpoint yet (its user module registers no
 * routes; RBAC only offers `POST /admin/users/:user_id/roles`). Show an honest
 * empty state instead of sample data until `GET /admin/users` exists.
 */
function RouteComponent() {
	return (
		<div className="flex w-full flex-col gap-6 pb-6">
			<AdminPageHeader
				title="Users"
				description="Accounts and roles for the admin area."
			/>
			<EmptyState
				icon={Users}
				title="User management is not available yet"
				description={
					<>
						The NextPressKit backend does not provide a user list endpoint yet.
						Accounts can register through <code>POST /auth/register</code>, and
						roles can be assigned with{" "}
						<code>POST /admin/users/:user_id/roles</code>. This page will list
						users once the API supports it.
					</>
				}
			/>
		</div>
	);
}
