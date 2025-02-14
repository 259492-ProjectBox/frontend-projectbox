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

    if (searchFields.courseNo) {
      fields.push("course.courseNo");
      searchInput.push(searchFields.courseNo);
    }
    if (searchFields.projectTitle) {
      fields.push("titleTH", "titleEN");
      searchInput.push(searchFields.projectTitle);
    }
    if (searchFields.studentNo) {
      fields.push("members.studentId");
      searchInput.push(searchFields.studentNo);
    }
    if (searchFields.advisorName) {
      fields.push("staffs.firstNameTH", "staffs.lastNameTH", "staffs.firstNameEN", "staffs.lastNameEN");
      searchInput.push(searchFields.advisorName);
    }

    const response = await axios.get(
      `https://search-service.kunmhing.me/api/v1/projects/fields`,
      {
        params: {
          searchInput: searchInput.join(" "),
          fields,
        },
        headers: {
          "Content-Type": "application/json",
          "accept": "application/json",
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
