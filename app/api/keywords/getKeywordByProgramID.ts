'use server'
import axios from "axios"
import { apiConfig } from "@/config/apiConfig"
import { Keyword } from "@/dtos/Keyword"

const getKeywordByProgramID = async (programID : number): Promise<Keyword[] | []> => {
  try {
    const response = await axios.get<Keyword>(apiConfig.ProjectService.GetKeywordByProgramID(programID), {
      headers: { Accept: "application/json" },
    })

    return Array.isArray(response.data) ? response.data : [response.data]
  } catch (error) {
    console.error("Error fetching project by ID:", error)
    throw error
  }
}

export default getKeywordByProgramID

