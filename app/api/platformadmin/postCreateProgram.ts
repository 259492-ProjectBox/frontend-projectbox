'use server'
import type { AllProgram } from "@/models/AllPrograms"
import axios from "axios"
import { apiConfig } from "@/config/apiConfig"

// Define a payload type for creating a program
type CreateProgramPayload = {
  program_name_en: string
  program_name_th: string
  abbreviation: string
}

// Function to post a new program
const postCreateProgram = async (payload: CreateProgramPayload): Promise<AllProgram> => {
  try {
    const response = await axios.post(apiConfig.ProjectService.Programs, payload, {
      headers: {
        "Content-Type": "application/json",
        accept: "application/json", // Added accept header as per the curl example
      },
    })
    return response.data
  } catch (error) {
    console.error("Error creating program:", error)
    throw error
  }
}

export default postCreateProgram

