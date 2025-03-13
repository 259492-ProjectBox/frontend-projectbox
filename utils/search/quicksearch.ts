'use server'
import axios from "axios"
import type { Project } from "../../models/Project"
import { apiConfig } from "@/config/apiConfig"

interface QuickSearchPayload {
  searchInput: string
  fields: string[]
}

const quickSearchProjects = async ({ searchInput, fields }: QuickSearchPayload): Promise<Project[]> => {
  try {
    const response = await axios.get(apiConfig.SearchService.ProjectAllFields, {
      params: {
        fields: fields.join(","),
        searchInput,
      },
      headers: {
        accept: "*/*",
      },
    })

    return response.data
  } catch (error) {
    console.error("Error fetching projects:", error)
    throw error
  }
}

export default quickSearchProjects

