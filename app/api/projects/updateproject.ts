'use server'
import axios from "axios"
import type { Project } from "@/models/Project"
import { apiConfig } from "@/config/apiConfig"

const updateProject = async (formData : FormData): Promise<Project> => {
  try {
    // console.log("FormData Contents:");
    //   for (const [key, value] of formData.entries()) {
    //     console.log(`${key}:`, value);
    //   }
    const response = await axios.put<Project>(apiConfig.ProjectService.UpdateProjects,formData, {
      headers: {  "Content-Type": "multipart/form-data" },
    })
    // console.log(`updateProject ${projectId}:`, response.data);

    return response.data
  } catch (error) {
    console.error("Error fetching project by ID:", error)
    throw error
  }
}

export default updateProject
