// utils/adminController.ts
import axios from "axios";

const API_URL = "https://auth-service.kunmhing.me/api/getAdmin";

// Function to fetch admin data from the API
export const getAdmins = async () => {
  try {
    const response = await axios.get(API_URL);
    // console.log("getAdmins:", response.data);
    
    return response.data; // Assuming the data is in the form you need
  } catch (error) {
    console.error("Error fetching admins:", error);
    throw error; // Propagate the error for the component to handle
  }
};
