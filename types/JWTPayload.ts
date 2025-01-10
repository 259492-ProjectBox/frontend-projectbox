export type JWTPayload = {
	cmuAccount: string;
	firstName: string;
	lastName: string;
	studentId?: string;
	orgName?: string;
	isAdmin: boolean;

};
