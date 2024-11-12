export type SuccessResponse = {
	ok: true;
	cmuAccount: string;
	firstName: string;
	lastName: string;
	studentId?: string;
	major: string;
};

export type ErrorResponse = {
	ok: false;
	message: string;
};

export type WhoAmIResponse = SuccessResponse | ErrorResponse;
