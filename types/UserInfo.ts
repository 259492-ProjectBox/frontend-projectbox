export type UserInfo = {
	cmuAccount: string;
    firstName: string;
    lastName: string;
    studentId?: string;
    isAdmin: number[];
    roles: string[];
    isPlatformAdmin: boolean;
};

export type FetchUserInfoResult = {
  user: UserInfo | null;
  error: string | null;
  isLoading: boolean;
};
