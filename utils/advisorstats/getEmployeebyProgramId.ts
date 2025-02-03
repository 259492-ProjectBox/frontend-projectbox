import axios from "axios";
import { Advisor } from "@/models/Advisor";

// Fetch employee data by Program ID
const getEmployeeByProgramId = async (id: number): Promise<Advisor[]> => {
  try {
    const response = await axios.get<Advisor[]>(
      `https://project-service.kunmhing.me/api/v1/staffs/program/${id}`,
      {
        headers: { Accept: "application/json" },
      }
    );
    console.log(`getEmployeeByProgramId ${id}:`, response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }
};

export default getEmployeeByProgramId;
