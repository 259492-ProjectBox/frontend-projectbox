import axios from "axios";

const API_URL = "https://auth-service.kunmhing.me/removeAdmin";

// Function to delete an admin
export const deleteAdmin = async (userAccount: string, adminAccount: string) => {
  try {
    const response = await axios.delete(API_URL, {
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        userAccount,
        adminAccount,
      },
    });
    // console.log("deleteAdmin:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error deleting admin:", error);
    throw error;
  }
};
