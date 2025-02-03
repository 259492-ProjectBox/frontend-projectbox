// utils/adminController.ts
import axios from "axios";

// API URL for creating admin
const CREATE_ADMIN_API_URL = "https://auth-service.kunmhing.me/createAdmin";

// Function to create a new admin
export const createAdmin = async (userAccount: string, adminAccount: string, programIds: number[]) => {
  try {
    const response = await axios.post(CREATE_ADMIN_API_URL, {
      userAccount,
      adminAccount,
      programId: programIds,
    });
    console.log("createAdmin:", response.data);
    
    return response.data; // Return the response after creating the admin
  } catch (error) {
    console.error("Error creating admin:", error);
    throw error; // Propagate the error to the component to handle
  }
};
