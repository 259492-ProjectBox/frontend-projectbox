import axios from "axios";
import { Project } from "@/models/Project";

const getProjectsByAdvisorId = async (advisorId: string): Promise<Project[]> => {
  try {
    const response = await axios.get(
      `https://search-service.kunmhing.me/api/v1/projects/selected-fields?fields=staffs.id&searchInputs=${advisorId}`,
      {
        headers: {
          accept: "*/*",
        },
      }
    );
    return response.data; // Adjust this to match your API response structure
  } catch (error) {
    console.error("Error in getProjectsByAdvisorId:", error);
    throw new Error("Failed to fetch projects data");
  }
};

export default getProjectsByAdvisorId;
