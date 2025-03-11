// utils/fetchUserInfo.ts
'use server'
import axios, { AxiosError } from "axios";
import { WhoAmIResponse } from "../dtos/WhoAmIResponse";
import { FetchUserInfoResult, UserInfo } from "../types/UserInfo";
import { serverGetCookie } from "./helpFunction";

export async function fetchUserInfo(): Promise<FetchUserInfoResult> {
  const token = serverGetCookie();
  try {
    const response = await axios.get<WhoAmIResponse>("http://localhost:3000/api/whoAmI", {
      headers: {
        Cookie: `cmuToken=${token}`,
      },
    });

    if (response.data.ok) {
      const userInfo: UserInfo = {
        cmuAccount: response.data.cmuAccount,
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        studentId: response.data.studentId,
        isAdmin: response.data.isAdmin,
        roles: response.data.roles,
        isPlatformAdmin: response.data.isPlatformAdmin, 
      };
      // console.log("Hello is Me", userInfo);
      return {
        user: userInfo,
        error: null,
        isLoading: false,
      };
    } else {
      return {
        user: null,
        error: response.data.message,
        isLoading: false,
      };
    }
  } catch (error) {
    const axiosError = error as AxiosError<WhoAmIResponse>;
    let errorMessage = "Unknown error occurred. Please try again later";

    if (!axiosError.response) {
      errorMessage = "Cannot connect to the network. Please try again later.";
    } else if (axiosError.response.status === 401) {
      errorMessage = "Authentication failed";
    }

    return {
      user: null,
      error: errorMessage,
      isLoading: false,
    };
  }
}
