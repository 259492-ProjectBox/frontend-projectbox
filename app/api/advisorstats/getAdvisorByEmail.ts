'use server'

import axios from "axios"
import type { Advisor } from "@/models/Advisor"
import { apiConfig } from "@/config/apiConfig"

const getAdvisorByEmail = async (employeeEmail: string): Promise<Advisor> => {
  try {
    const decodedEmail = decodeURIComponent(employeeEmail)
    
    const response = await axios.get(apiConfig.ProjectService.StaffByEmail(decodedEmail))
    // console.log("response.data", response.data);
    
    return response.data
  } catch (error) {
    console.error("Error in getAdvisorByEmail:", error)
    throw new Error("Failed to fetch employee data")
  }
}

export default getAdvisorByEmail

