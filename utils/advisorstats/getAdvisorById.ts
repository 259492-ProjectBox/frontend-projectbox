import axios from "axios";
import { Advisor } from "@/models/Advisor"; // Assuming this matches the response structure

const getEmployeeById = async (employeeId: string): Promise<Advisor> => {
  try {
    const response = await axios.get(
      `https://project-service.kunmhing.me/employee/${employeeId}`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );
    return response.data; // Adjust this to match the exact API response structure if needed
  } catch (error) {
    console.error("Error in getEmployeeById:", error);
    throw new Error("Failed to fetch employee data");
  }
};

export default getEmployeeById;
