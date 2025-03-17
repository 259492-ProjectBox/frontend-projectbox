'use server'
import type { ConfigProgramSetting } from "@/models/ConfigProgram"
import axios from "axios"
import { apiConfig } from "@/config/apiConfig"

export const updateConfigProgram = async (config: ConfigProgramSetting) => {
  try {
    const response = await axios.put(apiConfig.ProjectService.Configs, config, {
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
    })
    return response.data
  } catch (error) {
    console.error("Error updating config program:", error)
    throw error
  }
}

