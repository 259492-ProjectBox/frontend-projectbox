import { AcademicYear } from "@/models/AcademicYear";
import axios from "axios";


export const getAcademicYears = async (): Promise<AcademicYear[]> => {
  try {
    const response = await axios.get<AcademicYear[]>(
      "https://project-service.kunmhing.me/api/v1/configs/academic-years",
      {
        headers: {
          accept: "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching academic years:", error);
    throw error;
  }
};
