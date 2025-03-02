"use client";
import { useEffect, useState   } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios, { AxiosError } from "axios";
import { SignInResponse } from "@/app/api/signIn/route";
interface OAuthCallbackState {
	isLoading: boolean;
	error: string | null;
}

export function useOAuthCallback() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const code = searchParams ? searchParams.get("code") : null;
	const [state, setState] = useState<OAuthCallbackState>({
		isLoading: true,
		error: null,
	});

	useEffect(() => {
		if (!code) return;

		const handleOAuthCallback = async () => {
			try {
				const response = await axios.post<SignInResponse>("/api/signIn", {
					authorizationCode: code,
				});

				if (response.data.ok) {
					router.push("/dashboard");
				}
			} catch (error) {
				const axiosError = error as AxiosError<SignInResponse>;
				let errorMessage = "Unknown error occurred. Please try again later.";

				if (!axiosError.response) {
					errorMessage =
						"Cannot connect to CMU OAuth Server. Please try again later.";
				} else if (!axiosError.response.data.ok) {
					errorMessage = axiosError.response.data.message;
				}

				setState({ isLoading: false, error: errorMessage });
			}
		};

		handleOAuthCallback();
	}, [code, router]);

	return {
		isLoading: state.isLoading,
		error: state.error,
	};
}
