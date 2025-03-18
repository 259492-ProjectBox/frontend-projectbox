'use server'
import axios from "axios"
import type { Project } from "../../../models/Project"
import { apiConfig } from "@/config/apiConfig"

interface SearchFields {
  courseNo: string | null
  projectTitle: string | null
  studentNo: string | null
  advisorName: string | null
  academicYear: string | null
  semester: string | null
  programId?: number
}

interface DetailSearchPayload {
  searchFields: SearchFields
}

const detailSearchProjects = async ({ searchFields }: DetailSearchPayload): Promise<Project[]> => {
  try {
    // Always include all fields in the correct order
    const fields = [
      "course.courseNo",
      "titleTH/titleEN",
      "members.studentId",
      "staffs.firstNameTH/staffs.lastNameTH/staffs.firstNameEN/staffs.lastNameEN",
      "academicYear",
      "semester",
      "programId",
    ]

    // Create search inputs array with empty strings for null/undefined values
    const searchInput = [
      searchFields.courseNo || "",
      searchFields.projectTitle || "",
      searchFields.studentNo || "",
      searchFields.advisorName || "",
      searchFields.academicYear || "",
      searchFields.semester || "",
      searchFields.programId && searchFields.programId !== 0 ? searchFields.programId.toString() : "",
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

export default detailSearchProjects

