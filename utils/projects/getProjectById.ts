import axios from "axios";
import { Project } from "@/models/Project";

const getProjectById = async (projectId: number): Promise<Project> => {
  try {
    const response = await axios.get<Project[]>(
      `https://search-service.kunmhing.me/api/v1/projects/fields?searchInput=${projectId}&fields[]=id`,
      {
        headers: { Accept: "application/json" },
      }
    );
    console.log(`getProjectById ${projectId}:`, response.data);
    
    if (response.data.length === 0) {
      throw new Error("No project found");
    }
    
    return response.data[0];
  } catch (error) {
    console.error("Error fetching project by ID:", error);
    throw error;
  }
};

export default getProjectById;
