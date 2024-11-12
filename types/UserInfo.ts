export type UserInfo = {
	cmuAccount: string;
	firstName: string;
	lastName: string;
	studentId?: string;
	major: string;
};

export type FetchUserInfoResult = {
	user: UserInfo | null;
	error: string | null;
	isLoading: boolean;
};
