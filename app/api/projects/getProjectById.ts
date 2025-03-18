'use server'
import axios from "axios"
import type { Project } from "@/models/Project"
import { apiConfig } from "@/config/apiConfig"

const getProjectById = async (projectId: number): Promise<Project> => {
  try {
    const response = await axios.get<Project>(apiConfig.SearchService.ProjectById(projectId), {
      headers: { Accept: "application/json" },
    })
    // console.log(`getProjectById ${projectId}:`, response.data);

    return response.data
  } catch (error) {
    console.error("Error fetching project by ID:", error)
    throw error
  }
}

export default getProjectById

