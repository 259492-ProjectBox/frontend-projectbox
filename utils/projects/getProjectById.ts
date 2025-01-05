import axios from "axios";
import { Project } from "@/models/Project";

const getProjectById = async (projectId: number): Promise<Project> => {
  try {
    const response = await axios.get<Project>(
      `https://project-service.kunmhing.me/projects/${projectId}`,
      {
        headers: { Accept: "application/json" },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching project by ID:", error);
    throw error;
  }
};

export default getProjectById;
