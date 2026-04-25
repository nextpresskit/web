export type User = {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	active: boolean;
	createdAt: string;
	updatedAt: string;
	rbac: {
		roles: string[];
		permissions: string[];
	};
	avatarUrl?: string;
	role?: string;
	status?: string;
};
