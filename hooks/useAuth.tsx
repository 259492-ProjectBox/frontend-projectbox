import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchUserInfo } from "../utils/fetchUserInfo";
import axios from "axios";
import { FetchUserInfoResult } from "@/types/UserInfo";

export function useAuth() {
	const [authState, setAuthState] = useState<FetchUserInfoResult>({
		user: null,
		isLoading: true,
		error: null,
	});

	const router = useRouter();

	// Function to fetch the user info and set the auth state
	const fetchAuthUser = async () => {
		setAuthState((prev) => ({ ...prev, isLoading: true }));
		const response = await fetchUserInfo();
		// console.log("Use Auth Data",response);
		
		if ("errorMessage" in response) {
			setAuthState({
				user: null,
				isLoading: false,
				error: response.error,
			});
		} else {
			setAuthState({ user: response.user, isLoading: false, error: null });
		}
	};
	
	// Function to sign out the user
	const signOut = async () => {
		try {
			await axios.post("/api/signOut").then((response) => {
				if(response.data.ok) {
					const SignOut = response.data.signOut;
					
					if (SignOut) { 
						// window.location.href = SignOut;
						setAuthState({ user: null, isLoading: false, error: null });

						router.push(SignOut);
					}
				 }else{
					 router.push("/dashboard");
				 }
				}  

			);
			setAuthState({ user: null, isLoading: false, error: null });
		} catch (error) {
			console.error("Sign-out error:", error);
			setAuthState((prev) => ({
				...prev,
				error: "Sign-out failed. Please try again.",
			}));
		}
	};

	// Effect to load user info when the hook is first used
	useEffect(() => {
		fetchAuthUser();
	}, []);

	return {
		...authState,
		signOut,
		reloadUser: fetchAuthUser, // Optional: manually reload user info if needed
	};
}
