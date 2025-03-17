'use server'
import type { AcademicYear } from "@/models/AcademicYear"
import axios from "axios"
import { apiConfig } from "@/config/apiConfig"

export const getAcademicYears = async (): Promise<AcademicYear[]> => {
  try {
    const response = await axios.get<AcademicYear[]>(apiConfig.ProjectService.AcademicYears, {
      headers: {
        accept: "application/json",
      },
    })
    return response.data
  } catch (error) {
    console.error("Error fetching academic years:", error)
    throw error
  }
}

