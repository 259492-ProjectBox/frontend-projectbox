import { Major } from "./Major";

export interface Member {
	id: string;
	prefix: string;
	first_name: string;
	last_name: string;
	email: string;
	major_id: number;
	major: Major;
}
