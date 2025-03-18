'use server'
import type { Project } from "@/models/Project"
import axios from "axios"
import { apiConfig } from "@/config/apiConfig"

export async function fetchPdfProjects(searchInput: string): Promise<Project[]> {
  try {
    const response = await axios.get<Project[]>(apiConfig.SearchService.ProjectContent, {
      params: {
        searchInput: searchInput,
      },
    })

    // console.log("PDF Search Response:", response.data);

    return response.data
  } catch (error) {
    console.error("Error fetching PDF search results:", error)
    throw error
  }
}

