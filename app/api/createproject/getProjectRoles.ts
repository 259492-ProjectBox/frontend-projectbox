'use server'
import axios from "axios"
import type { ProjectRole } from "../../../models/ProjectRoles"
import { apiConfig } from "@/config/apiConfig"

export const getProjectRoles = async (): Promise<ProjectRole[]> => {
  try {
    const response = await axios.get(apiConfig.ProjectService.ProjectRolesByProgram(1), {
      headers: {
        accept: "application/json",
      },
    })
    return response.data
  } catch (error) {
    console.error("Error fetching project roles:", error)
    throw error
  }
}

