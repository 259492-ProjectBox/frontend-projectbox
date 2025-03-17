'use server'
import axios from "axios"
import { apiConfig } from "@/config/apiConfig"

export const uploadCreateProject = async (file: File, programId: number) => {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("program_id", programId.toString())

  const response = await axios.post(apiConfig.ProjectService.UploadCreateProject(programId), formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
    },
  })

  return response.data
}

