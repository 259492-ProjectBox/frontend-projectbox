'use server'
import axios from "axios"
import type { ProjectResourceConfig } from "@/models/ProjectResourceConfig"
import { apiConfig } from "@/config/apiConfig"

const updateResourceStatus = async (iconFile: File | null, data: ProjectResourceConfig) => {
  const formData = new FormData()
  if (iconFile) {
    formData.append("icon", iconFile)
  }
  formData.append("projectResourceConfig", JSON.stringify(data))

  try {
    const response = await axios.put(apiConfig.ProjectService.ProjectResourceConfigsV2, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  } catch (error) {
    console.error("Error updating resource status:", error)
    throw error
  }
}

export default updateResourceStatus

