'use server'
import { apiConfig } from "@/config/apiConfig"
import { ProjectConfig } from "@/models/ProjectConfig";

const getProjectConfig = async (majorId: number): Promise<ProjectConfig[]> => {
  try {
    const response = await fetch(apiConfig.ProjectService.ProjectConfigsByProgram(majorId))
    console.log("Response:",response);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch project config: ${response.statusText}`)
    }
    // console.log("ProjectConfig:",response)
    return await response.json()
  } catch (error) {
    console.error("Error fetching project config:", error)
    throw error
  }
}

export default getProjectConfig

