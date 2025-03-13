'use server'
// utils/pdfSearchApi.ts

import axios from "axios"
import type { Project } from "@/models/SearchContenetPdf"
import { apiConfig } from "@/config/apiConfig"

export async function fetchPdfProjects(searchInput: string): Promise<Project[]> {
  try {
    const response = await axios.get<Project[]>(apiConfig.SearchService.ProjectContent, {
      // Pass the search input as a query parameter
      params: {
        searchInput: searchInput,
      },
    })

    // Log the data to the console
    // console.log("PDF Search Response:", response.data);

    return response.data
  } catch (error) {
    console.error("Error fetching PDF search results:", error)

    throw error
  }
}

