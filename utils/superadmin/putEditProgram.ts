'use server'
import axios from "axios"
import type { Program } from "@/models/Program"
import { apiConfig } from "@/config/apiConfig"

type EditProgramData = Omit<Program, "id"> & { id: number }

const putEditProgram = async (data: EditProgramData): Promise<Program> => {
  try {
    const response = await axios.put(apiConfig.ProjectService.Programs, data, {
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
    })
    return response.data
  } catch (error) {
    console.error("Error editing program:", error)
    throw error
  }
}

export default putEditProgram

