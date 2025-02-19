import axios from "axios";
import { Project } from '../../models/Project';

interface DetailSearchPayload {
  searchFields: {
    courseNo: string;
    projectTitle: string;
    studentNo: string;
    advisorName: string;
  };
}

const detailSearchProjects = async ({ searchFields }: DetailSearchPayload): Promise<Project[]> => {
  try {
    const fields = [];
    const searchInput = [];

    fields.push("course.courseNo");
    searchInput.push(searchFields.courseNo || "");

    fields.push("titleTH/titleEN");
    searchInput.push(searchFields.projectTitle || "");

    fields.push("members.studentId");
    searchInput.push(searchFields.studentNo || "");

    fields.push("staffs.firstNameTH/staffs.lastNameTH/staffs.firstNameEN/staffs.lastNameEN");
    searchInput.push(searchFields.advisorName || "");

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
