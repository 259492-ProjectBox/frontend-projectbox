// utils/projects/getProjectByStudentId.ts
import axios from "axios";
import { Project } from "@/models/Project";

const getProjectByStudentId = async (studentId: string): Promise<Project[]> => {
  try {
    const response = await axios.get<Project[]>(
      `https://project-service.kunmhing.me/api/v1/projects/student/${studentId}`,
      {
        headers: { Accept: "application/json" },
      }
    );
    console.log(`getProjectByStudentId ${studentId}:`, response.data);

    return response.data;
  } catch (error) {
    console.error("Error fetching project data:", error);
    throw error;
  }
};

export default getProjectByStudentId;
