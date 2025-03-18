'use server'
// utils/projects/getProjectByStudentId.ts
import axios from "axios"
import type { Project } from "@/models/Project"
import { apiConfig } from "@/config/apiConfig"

const getProjectByStudentId = async (studentId: string): Promise<Project[]> => {
  try {
    const response = await axios.get<Project[]>(
      `${apiConfig.SearchService.ProjectSelectedFields}?fields=members.studentId&searchInputs=${studentId}`,
      {
        headers: { Accept: "application/json" },
      },
    )
    // console.log(`getProjectByStudentId ${studentId}:`, response.data);

    return response.data
  } catch (error) {
    console.error("Error fetching project data:", error)
    throw error
  }
}

export default getProjectByStudentId

