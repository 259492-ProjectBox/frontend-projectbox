'use server'
import axios from "axios"
import type { Student } from "@/models/Student"
import { apiConfig } from "@/config/apiConfig"

export const getStudentsByProgram = async (programId: number): Promise<Student[]> => {
  try {
    const response = await axios.get(apiConfig.ProjectService.StudentsByProgramCurrentYear(programId), {
      headers: {
        accept: "application/json",
      },
    })
    // console.log("getStudentsByProgram:", response.data);
    return response.data
  } catch (error) {
    console.error("Error fetching students by program:", error)
    throw error
  }
}

