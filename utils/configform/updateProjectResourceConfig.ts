import axios from "axios";
import { ProjectResourceConfig } from "@/models/ProjectResourceConfig";

// Define the endpoint for updating the project resource
const API_URL = "https://project-service.kunmhing.me/api/v1/projectResourceConfigs";

// Define a function to update the resource's active status
const updateResourceStatus = async (data: ProjectResourceConfig) => {
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
