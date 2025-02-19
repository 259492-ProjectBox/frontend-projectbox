import axios from "axios";
import { Project } from '../../models/Project';

interface QuickSearchPayload {
  searchInput: string;
  fields: string[];
}

const quickSearchProjects = async ({ searchInput, fields }: QuickSearchPayload): Promise<Project[]> => {
  try {
    const response = await axios.get(
      `https://search-service.kunmhing.me/api/v1/projects/all-fields`,
      {
        params: {
          fields: fields.join(","),
          searchInput
        },
        headers: {
          "accept": "*/*",
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};

export default quickSearchProjects;
