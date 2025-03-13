'use server'
import type { AllProgram } from "@/models/AllPrograms"
import axios from "axios"
import { apiConfig } from "@/config/apiConfig"

const getAllProgram = async (): Promise<AllProgram[]> => {
  try {
    const response = await axios.get(apiConfig.ProjectService.Programs, {
      headers: { Accept: "application/json" },
    })
    // console.log("getAllProgram:",response.data);
    // Assuming the response.data is an array of majors
    return response.data as AllProgram[]
  } catch (error) {
    console.error("Error fetching program data:", error)
    throw error // Rethrow the error for further handling if needed
  }
}

export default getAllProgram

