import axios from "axios";
import { Advisor } from "@/models/Advisor";

// Define a payload type for creating an advisor
type CreateAdvisorPayload = Omit<Advisor, "id">;

// Function to post a new advisor
const postCreateAdvisor = async (payload: CreateAdvisorPayload): Promise<Advisor> => {
  try {
    const response = await axios.post<Advisor>(
      "https://project-service.kunmhing.me/employee",
      payload,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating advisor:", error);
    throw error;
  }
};

export default postCreateAdvisor;
