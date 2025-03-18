'use server'
import { apiConfig } from "@/config/apiConfig"

export const createProjectCheckPermission = async (studentId: string) => {
  try {
    const response = await fetch(apiConfig.ProjectService.CheckStudentPermission(studentId), {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    })
    const data = await response.json()
    return data.has_permission
  } catch (error) {
    console.error("Error checking permission:", error)
    return false
  }
}

