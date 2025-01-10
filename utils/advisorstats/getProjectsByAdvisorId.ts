import axios from "axios";
import { Project } from "@/models/Project";

const getProjectsByAdvisorId = async (advisorId: string): Promise<Project[]> => {
  try {
    const response = await axios.get(
      `https://project-service.kunmhing.me/projects/advisor/${advisorId}`
    );
    return response.data; // Adjust this to match your API response structure
  } catch (error) {
    console.error("Error in getProjectsByAdvisorId:", error);
    throw new Error("Failed to fetch projects data");
  }
};

export default getProjectsByAdvisorId;
