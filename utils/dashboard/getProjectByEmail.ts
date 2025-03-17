'use server'
import type { Project } from "@/models/Project"
import { apiConfig } from "@/config/apiConfig"

const getProjectByEmail = async (email: string): Promise<Project[]> => {
  
  const response = await fetch(
    
    `${apiConfig.SearchService.ProjectSelectedFields}?fields=staffs.email&searchInputs=${email}`,
    {
      method: "GET",
      headers: {
        accept: "*/*",
      },
    },
  )

  if(response.status === 500) {
    return []
  }
  if (!response.ok) {
    throw new Error(`Error fetching projects for email ${email}: ${response.statusText}`)
  }

  const data = await response.json()
  return data as Project[]
}

export default getProjectByEmail

