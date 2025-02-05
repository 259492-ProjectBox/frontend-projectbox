import axios from "axios";
import { ProjectResourceConfig } from "@/models/ProjectResourceConfig";

const createProjectResource = async (data: ProjectResourceConfig) => {
  const API_URL =
    "https://project-service.kunmhing.me/api/v1/projectResourceConfigs";
  try {
    const response = await axios.put(API_URL, data, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating project resource:", error);
    throw error;
  }
};

export default createProjectResource;
