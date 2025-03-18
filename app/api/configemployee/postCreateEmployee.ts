'use server'
import axios from "axios"
import type { Advisor } from "@/models/Advisor"
import { apiConfig } from "@/config/apiConfig"

// Define a payload type for creating an advisor (aligned with API)
type CreateAdvisorPayload = Omit<Advisor, "id">

// Function to post a new advisor
const postCreateEmployee = async (payload: CreateAdvisorPayload): Promise<Advisor> => {
  try {
    const response = await axios.post<Advisor>(apiConfig.ProjectService.Staffs, payload, {
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
    })
    return response.data
  } catch (error) {
    console.error("Error creating advisor:", error)
    throw error
  }
}

export const uploadStaffFromExcel = async (programId: number, file: File): Promise<string> => {
  try {
    const formData = new FormData()
    formData.append("file", file)
    const response = await axios.post(apiConfig.ProjectService.UploadCreateStaff(programId), formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        accept: "application/json",
      },
    })
    return response.data.message
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data.error
    }
    console.error("Error uploading staff from excel:", error)
    throw error
  }
}

export default postCreateEmployee

