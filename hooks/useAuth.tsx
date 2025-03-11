'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { fetchUserInfo } from "../utils/fetchUserInfo";
import axios from "axios";
import { FetchUserInfoResult } from "@/types/UserInfo";

// Create the auth context
type AuthContextType = FetchUserInfoResult & {
  signOut: () => Promise<void>;
  setAuthState: React.Dispatch<React.SetStateAction<FetchUserInfoResult>>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<FetchUserInfoResult>({
    user: null,
    isLoading: true,
    error: null,
  });

  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const user = await fetchUserInfo();
      setAuthState(user);
    };
    fetchUser();
  }, []);


  // Function to sign out the user
  const signOut = async () => {
    try {
      await axios.post("/api/signOut").then((response) => {
        if(response.data.ok) {
          const SignOut = response.data.signOut;
          
          if (SignOut) { 
            setAuthState({ user: null, isLoading: false, error: null });
            router.push(SignOut);
          }
        } else {
          router.push("/dashboard");
        }
      });
    } catch (error) {
      console.error("Sign-out error:", error);
      setAuthState((prev) => ({
        ...prev,
        error: "Sign-out failed. Please try again.",
      }));
    }
  };

  const contextValue: AuthContextType = {
    ...authState,
    signOut,
	setAuthState
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for using the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
}