import axios from "axios";
import { Project } from '../../models/Project';

interface SearchFields {
  courseNo: string | null;
  projectTitle: string | null;
  studentNo: string | null;
  advisorName: string | null;
  academicYear: string | null;
  semester: string | null;
  programId?: number;
}

interface DetailSearchPayload {
  searchFields: SearchFields;
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
      "programId"
    ];

    // Create search inputs array with empty strings for null/undefined values
    const searchInput = [
      searchFields.courseNo || "",
      searchFields.projectTitle || "",
      searchFields.studentNo || "",
      searchFields.advisorName || "",
      searchFields.academicYear || "",
      searchFields.semester || "",
      searchFields.programId && searchFields.programId !== 0 ? searchFields.programId.toString() : ""
    ];
    // const fields = [];
    // const searchInput = [];

    // if (searchFields.courseNo) {
    //   fields.push("course.courseNo");
    //   searchInput.push(searchFields.courseNo);
    // }

    // if (searchFields.projectTitle) {
    //   fields.push("titleTH/titleEN");
    //   searchInput.push(searchFields.projectTitle);
    // }

    // if (searchFields.studentNo !== null || searchFields.studentNo !== "") {
    //   fields.push("members.studentId");
    //   searchInput.push(searchFields.studentNo);
    // }

    // if (searchFields.advisorName !== null || searchFields.advisorName !== "") {
    //   fields.push("staffs.firstNameTH/staffs.lastNameTH/staffs.firstNameEN/staffs.lastNameEN");
    //   searchInput.push(searchFields.advisorName);
    // }

    // if (searchFields.academicYear !== null || searchFields.academicYear !== "") {
    //   fields.push("academicYear");
    //   searchInput.push(searchFields.academicYear);
    // }

    // if (searchFields.semester !== null || searchFields.semester !== "") {
    //   fields.push("semester");
    //   searchInput.push(searchFields.semester);
    // }

    // if (searchFields.programId !== undefined || searchFields.programId !== null ) {
    //   fields.push("programId");
    //   if (searchFields.programId !== undefined && searchFields.programId !== null && searchFields.programId !== 0) {
    //     searchInput.push(searchFields.programId.toString());
    //   }
    // }

    const response = await axios.get(
      `https://search-service.kunmhing.me/api/v1/projects/selected-fields`,
      {
        params: {
          fields: fields.join(","),
          searchInputs: searchInput.join(",")
        },
        headers: {
          "accept": "*/*",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};

export default detailSearchProjects;

