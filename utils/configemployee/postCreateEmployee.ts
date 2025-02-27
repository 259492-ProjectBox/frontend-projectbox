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
          accept: "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating advisor:", error);
    throw error;
  }
};

export const uploadStaffFromExcel = async (programId: number, file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await axios.post(
      `https://project-service.kunmhing.me/api/v1/uploads/program/${programId}/create-staff`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          accept: "application/json",
        },
      }
    );
    return response.data.message;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data.error;
    }
    console.error("Error uploading staff from excel:", error);
    throw error;
  }
};

export default postCreateEmployee;
