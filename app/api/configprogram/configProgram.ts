'use server'
// src/hooks/useConfigData.ts
import type { ConfigProgramSetting } from "@/models/ConfigProgram"
import axios from "axios"
import { apiConfig } from "@/config/apiConfig"

export const getConfigProgram = async (programId: number): Promise<ConfigProgramSetting[]> => {
  try {
    const response = await axios.get(apiConfig.ProjectService.ConfigsByProgram(programId), {
      headers: {
        accept: "application/json",
      },
    })
    const data: ConfigProgramSetting[] = response.data
    return data
  } catch (error) {
    console.error("Error fetching data:", error)
    throw error
  }
}

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

