'use server'
import axios from "axios"
import { apiConfig } from "@/config/apiConfig"

const deleteKeywordByProgramID = async (programID: number): Promise<void> => {
  try {
    await axios.delete(apiConfig.ProjectService.DeleteKeyword(programID), {
      headers: { Accept: "application/json" },
    })
  } catch (error) {
    console.error("Error deleting keyword by ID:", error)
    throw error
  }
}

export default deleteKeywordByProgramID