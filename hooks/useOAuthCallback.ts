"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios, { AxiosError } from "axios";
import { SignInResponse } from "@/app/api/signIn/route";
import { useAuth } from "./useAuth";
import { fetchUserInfo } from "@/utils/fetchUserInfo";

interface OAuthCallbackState {
  isLoading: boolean;
  error: string | null;
}

export function useOAuthCallback() {
  const {setAuthState} = useAuth()
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams ? searchParams.get("code") : null;
  const errorParam = searchParams ? searchParams.get("error") : null;
  const errorDescription = searchParams ? searchParams.get("error_description") : null;
  const [state, setState] = useState<OAuthCallbackState>({
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    if (errorParam) {
      setState({
        isLoading: false,
        error: `${errorParam}: ${errorDescription}`,
      });
      router.push("/"); // Redirect to home page on error
      return;
    }

    if (!code) return;

    const handleOAuthCallback = async () => {
      try {
        const response = await axios.post<SignInResponse>("/api/signIn", {
          authorizationCode: code,
        });

        if (response.data.ok) {
          const user = await fetchUserInfo()
          setAuthState(user)
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
        router.push("/"); // Redirect to home page on error
      }
    };

    handleOAuthCallback();
  }, [code, errorParam, errorDescription, router]);

  return {
    isLoading: state.isLoading,
    error: state.error,
  };
}
