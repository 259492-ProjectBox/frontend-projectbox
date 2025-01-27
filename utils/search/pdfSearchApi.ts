// utils/pdfSearchApi.ts

import axios from "axios";
import { Project } from "@/models/SearchContenetPdf";

export async function fetchPdfProjects(searchInput: string): Promise<Project[]> {
  try {
    const response = await axios.get<Project[]>(
      `https://search-service.kunmhing.me/api/v1/projects/content`,
      {
        // Pass the search input as a query parameter
        params: {
          searchInput: searchInput,
        },
      }
    );

    // Log the data to the console
    console.log("PDF Search Response:", response.data);

    return response.data;
  } catch (error) {
    console.error("Error fetching PDF search results:", error);
    console.log("test");
    
    throw error;
  }
}
