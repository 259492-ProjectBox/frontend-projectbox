'use server'

import axios from "axios"
import type { Advisor } from "@/models/Advisor"
import { apiConfig } from "@/config/apiConfig"

// Fetch employee data by Program ID
const getEmployeeByProgramId = async (id: number): Promise<Advisor[]> => {
  try {
    const response = await axios.get<Advisor[]>(apiConfig.ProjectService.StaffsByProgram(id), {
      headers: { Accept: "application/json" },
    })
    // console.log(`getEmployeeByProgramId ${id}:`, response.data);
    return response.data
  } catch (error) {
    console.error("Error fetching employees:", error)
    throw error
  }
}

export default getEmployeeByProgramId

