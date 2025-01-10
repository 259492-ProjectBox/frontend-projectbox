export type SuccessResponse = {
	major(major: any): unknown;
	ok: true;
	cmuAccount: string;
	firstName: string;
	lastName: string;
	studentId?: string;
	orgName: string;
	isAdmin: boolean;
};

export type ErrorResponse = {
	ok: false;
	message: string;
};

export type WhoAmIResponse = SuccessResponse | ErrorResponse;
