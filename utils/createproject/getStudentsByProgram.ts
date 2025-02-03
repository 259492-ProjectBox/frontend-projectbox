import axios from "axios";
import { Student } from "@/models/Student";

const API_URL = "https://project-service.kunmhing.me/api/v1/students/program";

export const getStudentsByProgram = async (programId: number): Promise<Student[]> => {
  try {
    const response = await axios.get(`${API_URL}/${programId}/current_year`, {
      headers: {
        'accept': 'application/json',
      },
    });
    console.log("getStudentsByProgram:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching students by program:", error);
    throw error;
  }
};
