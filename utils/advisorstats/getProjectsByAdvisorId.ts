'use server'

import axios from "axios"
import type { Project } from "@/models/Project"
import { apiConfig } from "@/config/apiConfig"

const getProjectsByAdvisorId = async (advisorId: string): Promise<Project[]> => {
  try {
    const response = await axios.get(
      `${apiConfig.SearchService.ProjectSelectedFields}?fields=staffs.id&searchInputs=${advisorId}`,
      {
        headers: {
          accept: "*/*",
        },
      },
    )
    return response.data
  } catch (error) {
    console.error("Error in getProjectsByAdvisorId:", error)
    throw new Error("Failed to fetch projects data")
  }
}

export default getProjectsByAdvisorId

