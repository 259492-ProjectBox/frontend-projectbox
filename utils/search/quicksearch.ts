import axios from "axios";
import { Project } from '../../models/Project';

// Define the search payload interface for type checking
interface QuickSearchPayload {
  searchInput: string;
  fields: string[];
}

// Function to search projects for quick search mode
const quickSearchProjects = async ({ searchInput, fields }: QuickSearchPayload): Promise<Project[]> => {
  try {
    const response = await axios.get(
      `https://search-service.kunmhing.me/api/v1/projects/fields`,
      {
        params: {
          searchInput,
          fields,
        },
        headers: {
          "Content-Type": "application/json",
          "accept": "application/json",
        },
      }
    );
    
    return response.data; // This will return the list of projects based on the search criteria
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error; // Handle error appropriately
  }
};

export default quickSearchProjects;
