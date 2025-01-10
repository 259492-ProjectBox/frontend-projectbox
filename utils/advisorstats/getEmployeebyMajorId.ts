import axios from "axios";
import { Advisor } from "@/models/Advisor"; // Import the Advisor interface

// Fetch employee data by Major ID
const getEmployeeByMajorId = async (id: number): Promise<Advisor[]> => {
  try {
    const response = await axios.get<Advisor[]>(
      `https://project-service.kunmhing.me/employee/GetByMajorID/${id}`,
      {
        headers: { Accept: "application/json" },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }
};

export default getEmployeeByMajorId;
