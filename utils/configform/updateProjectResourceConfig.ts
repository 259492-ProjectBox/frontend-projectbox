import axios from "axios";

// Define the endpoint for updating the project resource
const API_URL = "https://project-service.kunmhing.me/api/v1/projectResourceConfigs";

// Define a function to update the resource's active status
const updateResourceStatus = async (data: {
  icon_name: string;
  id: number;
  is_active: boolean;
  program_id: number;
  resource_type_id: number;
  title: string;
}) => {
  try {
    const response = await axios.put(API_URL, data, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating resource status:", error);
    throw error;
  }
};

export default updateResourceStatus;
