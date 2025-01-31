export type SuccessResponse = {
	major(major: any): unknown;
	ok: true;
    cmuAccount: string;
    firstName: string;
    lastName: string;
    studentId?: string;
    isAdmin: number[];
    roles: string[];
    isPlatformAdmin: boolean;
};

export type ErrorResponse = {
	ok: false;
	message: string;
};

export type WhoAmIResponse = SuccessResponse | ErrorResponse;
