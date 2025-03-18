'use server'
import axios from "axios"
import { apiConfig } from "@/config/apiConfig"

// Function to delete an admin
export const deleteAdmin = async (userAccount: string, adminAccount: string) => {
  try {
    const response = await axios.delete(apiConfig.AuthService.RemoveAdmin, {
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        userAccount,
        adminAccount,
      },
    })
    // console.log("deleteAdmin:", response.data);
    return response.data
  } catch (error) {
    console.error("Error deleting admin:", error)
    throw error
  }
}

