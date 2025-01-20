import { AllProgram } from "@/models/AllPrograms";
import axios from "axios";

const getAllProgram = async (): Promise<AllProgram[]> => {
  try {
    const response = await axios.get(
      "https://project-service.kunmhing.me/major/GetAllMajor",
      {
        headers: { Accept: "application/json" },
      }
    );

    // Assuming the response.data is an array of majors
    return response.data as AllProgram[];
  } catch (error) {
    console.error("Error fetching program data:", error);
    throw error;  // Rethrow the error for further handling if needed
  }
};

export default getAllProgram;
