import { Student } from "@/models/Student";
import axios from "axios";


export const getStudentsByProgram = async (
  programId: number,
  academicYear: number,
  semester: number
): Promise<Student[]> => {
  try {
    const response = await axios.get<Student[]>(
      `https://project-service.kunmhing.me/api/v1/students/program/${programId}`,
      {
        params: {
          academic_year: academicYear,
          semester: semester,
        },
        headers: {
          accept: "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching students by program:", error);
    throw error;
  }
};
