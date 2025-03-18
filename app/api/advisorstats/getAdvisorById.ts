'use server'

import axios from "axios"
import type { Advisor } from "@/models/Advisor"
import { apiConfig } from "@/config/apiConfig"

const getEmployeeById = async (employeeId: string): Promise<Advisor> => {
  try {
    const response = await axios.get(apiConfig.ProjectService.StaffById(employeeId), {
      headers: {
        Accept: "application/json",
      },
    })
    return response.data
  } catch (error) {
    console.error("Error in getEmployeeById:", error)
    throw new Error("Failed to fetch employee data")
  }
}

export default getEmployeeById

