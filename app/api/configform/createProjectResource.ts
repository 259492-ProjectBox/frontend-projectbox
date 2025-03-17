'use server'
import axios from "axios"
import { apiConfig } from "@/config/apiConfig"

const createProjectResource = async (iconFile: File, data: any) => {
  const formData = new FormData()
  formData.append("icon", iconFile)
  formData.append("projectResourceConfig", JSON.stringify(data))

  try {
    const response = await axios.put(apiConfig.ProjectService.ProjectResourceConfigsV2, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  } catch (error) {
    console.error("Error creating project resource:", error)
    throw error
  }
}

export default createProjectResource

