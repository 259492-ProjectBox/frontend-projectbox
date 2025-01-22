import axios from "axios";
import { Advisor } from "@/models/Advisor";

// Define a payload type for creating an advisor (aligned with API)
type CreateAdvisorPayload = Omit<Advisor, "id">;

// Function to post a new advisor
const postCreateEmployee = async (payload: CreateAdvisorPayload): Promise<Advisor> => {
  try {
    const response = await axios.post<Advisor>(
      "https://project-service.kunmhing.me/api/v1/staffs",
      payload,
      {
        headers: { 
          "Content-Type": "application/json",
          "accept": "application/json"  // Added accept header as per the curl example
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating advisor:", error);
    throw error;
  }
};

export default postCreateEmployee;
