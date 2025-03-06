import axios from "axios";
import { Project } from "../models/Project";

export async function fetchPdfProjects(searchInput: string): Promise<Project[]> {
  try {
    const response = await axios.get<Project[]>(
      `https://search-service.kunmhing.me/api/v1/projects/content`,
      {
        params: {
          searchInput: searchInput,
        },
      }
    );

    console.log("PDF Search Response:", response.data);

    return response.data;
  } catch (error) {
    console.error("Error fetching PDF search results:", error);
    throw error;
  }
}
