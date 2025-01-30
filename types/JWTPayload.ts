export type JWTPayload = {
	cmuAccount: string;
	firstName: string;
	lastName: string;
	studentId?: string;
	isAdmin: number[];
	roles: string[];
	isPlatformAdmin: boolean;
};