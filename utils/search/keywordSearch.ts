'use server'
import axios from "axios"
import type { Project } from "../../models/Project"
import { apiConfig } from "@/config/apiConfig"

export interface KeywordSearchFields {
  keyword_id: number
}

interface KeywordSearchPayload {
  searchFields: KeywordSearchFields
}

const keywordSearchProjects = async ({ searchFields }: KeywordSearchPayload): Promise<Project[]> => {
  try {
    
    const fields = [
      "keywords.id", // Only keyword field is kept
    ]

    // Create search inputs array with empty strings for null/undefined values
    const searchInput = [
      searchFields.keyword_id || "", // Only keyword field is kept
    ]

    const response = await axios.get(apiConfig.SearchService.ProjectSelectedFields, {
      params: {
        fields: fields.join(","),
        searchInputs: searchInput.join(","),
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

export default keywordSearchProjects

