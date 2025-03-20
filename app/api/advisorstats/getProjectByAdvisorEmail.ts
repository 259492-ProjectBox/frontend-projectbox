'use server'

import axios from "axios"
import type { Project } from "@/models/Project"
import { apiConfig } from "@/config/apiConfig"

const getProjectByAdvisorEmail = async (advisorId: string): Promise<Project[]> => {
  
  const decodedEmail = decodeURIComponent(advisorId);
  
  try {
    const response = await axios.get(
      `${apiConfig.SearchService.ProjectAllFields}?fields=staffs.email&searchInput=${decodedEmail}`,
      {
        headers: {
          accept: "*/*",
        },
      },
    )
    
    return response.data
  } catch (error) {
    console.error("Error in getProjectsByAdvisorEmail:", error)
    throw new Error("Failed to fetch projects data")
  }
}

export default getProjectByAdvisorEmail