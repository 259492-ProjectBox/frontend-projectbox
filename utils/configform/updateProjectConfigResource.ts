import axios from "axios";
import { ProjectResourceConfig } from "@/models/ProjectRespurceConfig";

export const fetchProjectResourceConfigs = async (programId: number) => {
  const API_URL = `https://project-service.kunmhing.me/api/v1/projectResourceConfigs/program/${programId}`;
  try {
    const response = await axios.get(API_URL, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    console.log("fetchProjectResourceConfigs.data", response.data);
    return response.data;
    
  } catch (error) {
    console.error("Error fetching project resource configs:", error);
    throw error;
  }
};

export const createProjectResource = async (data: {
  icon_name: string;
  is_active: boolean;
  program_id: number;
  resource_type_id: number;
  title: string;
}) => {
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

export const updateResourceStatus = async (data: ProjectResourceConfig) => {
  const API_URL = `https://project-service.kunmhing.me/api/v1/projectResourceConfigs/${data.id}`;
  try {
    const response = await axios.patch(API_URL, data, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating resource status:", error);
    throw error;
  }
};
