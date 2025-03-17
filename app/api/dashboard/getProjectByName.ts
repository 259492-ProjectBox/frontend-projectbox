'use server'
import type { Project } from "@/models/Project"
import { apiConfig } from "@/config/apiConfig"

const getProjectByName = async (name: string): Promise<Project[]> => {
  const response = await fetch(
    `${apiConfig.SearchService.ProjectSelectedFields}?fields=staffs.firstNameEN%2Cstaffs.lastNameEN&searchInputs=${name}`,
    {
      method: "GET",
      headers: {
        accept: "*/*",
      },
    },
  )

  if (!response.ok) {
    throw new Error(`Error fetching projects for name ${name}: ${response.statusText}`)
  }

  const data = await response.json()
  return data as Project[]
}

export default getProjectByName

