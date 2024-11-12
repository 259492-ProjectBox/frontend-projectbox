import { Role } from "./Role";

export interface Advisor {
	id: number;
	prefix: string;
	first_name: string;
	last_name: string;
	email: string;
	role_id: number;
	role: Role;
}
