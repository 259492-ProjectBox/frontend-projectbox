'use server'
// src/utils/apiController.ts
import type { ProjectResourceConfig } from "@/models/ProjectResourceConfig"
import axios from "axios"
import { apiConfig } from "@/config/apiConfig"

export const getProjectResourceConfig = async (programId: number): Promise<ProjectResourceConfig[]> => {
  try {
    const response = await axios.get(apiConfig.ProjectService.ProjectResourceConfigsByProgramV1(programId), {
      headers: {
        accept: "application/json",
      },
    })
    // console.log("getProjectResourceConfig", response.data);

    // Ensure the response data is valid
    if (response.data) {
      return response.data
    } else {
      throw new Error("Invalid response data")
    }
  } catch (error) {
    console.error("Error fetching data:", error)
    throw error // Rethrow error to handle it in the component
  }
}

