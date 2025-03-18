'use server'
import type { Student } from "../../../models/Student"
import { apiConfig } from "@/config/apiConfig"

export const getStudentInfo = async (studentId: string): Promise<Student | null> => {
  try {
    const response = await fetch(apiConfig.ProjectService.StudentById(studentId), {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    })
    const data = await response.json()
    // console.log("getStudentInfo data:", data);

    return data
  } catch (error) {
    console.error("Error fetching student data:", error)
    return null
  }
}

