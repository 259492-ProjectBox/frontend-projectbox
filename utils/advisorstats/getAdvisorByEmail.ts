import axios from "axios";
import { Advisor } from "@/models/Advisor"; // Assuming this matches the response structure

const getAdvisorByEmail = async (employeeEmail: string): Promise<Advisor> => {
  try {
    const response = await axios.get(
      `https://project-service.kunmhing.me/api/v1/staffs/email/${employeeEmail}`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );
    return response.data; 
  } catch (error) {
    console.error("Error in getAdvisorByEmail:", error);
    throw new Error("Failed to fetch employee data");
  }
};

export default getAdvisorByEmail;
