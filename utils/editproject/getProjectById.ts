import axios from "axios";
import { Project } from "@/models/Project";

export const getProjectById = async (id: string): Promise<Project> => {
  try {
    const response = await axios.get<Project>(`https://search-service.kunmhing.me/api/v1/projects/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching project by ID:", error);
    throw error;
  }
};
