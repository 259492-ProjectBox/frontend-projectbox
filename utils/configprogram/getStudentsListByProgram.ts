'use server'
import type { Student } from "@/models/Student"
import axios from "axios"
import { apiConfig } from "@/config/apiConfig"

export const getStudentsByProgram = async (
  programId: number,
  academicYear: number,
  semester: number,
): Promise<Student[]> => {
  try {
    const response = await axios.get<Student[]>(apiConfig.ProjectService.StudentsByProgram(programId), {
      params: {
        academic_year: academicYear,
        semester: semester,
      },
      headers: {
        accept: "application/json",
      },
    })
    return response.data
  } catch (error) {
    console.error("Error fetching students by program:", error)
    throw error
  }
}

