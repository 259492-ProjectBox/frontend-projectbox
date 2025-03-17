'use server'
// utils/configemployee/postUpdateEmployee.ts
import axios from "axios"
import type { Advisor } from "@/models/Advisor"
import { apiConfig } from "@/config/apiConfig"

const putUpdateEmployee = async (advisor: Advisor): Promise<Advisor> => {
  try {
    // console.log("Sending update request for advisor:", advisor);
    const response = await axios.put<Advisor>(
      apiConfig.ProjectService.Staffs,
      {
        ...advisor,
      },
      {
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
      },
    )
    // console.log("Received response for update request:", response.data);
    return response.data
  } catch (error) {
    console.error("Error updating advisor:", error)
    throw error
  }
}

export default putUpdateEmployee

