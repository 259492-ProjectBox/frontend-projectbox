import { Student } from "../../models/Student";

export const getStudentInfo = async (studentId: string): Promise<Student | null> => {
  try {
    const response = await fetch(
      `https://project-service.kunmhing.me/api/v1/students/${studentId}`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
        },
      }
    );
    const data = await response.json();
    console.log("getStudentInfo data:", data);
    
    return data;
  } catch (error) {
    console.error("Error fetching student data:", error);
    return null;
  }
};
