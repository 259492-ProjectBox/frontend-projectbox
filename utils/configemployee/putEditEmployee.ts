// utils/configemployee/postUpdateEmployee.ts
import axios from "axios";
import { Advisor } from "@/models/Advisor"; // Assuming Advisor is used in the application

const putUpdateEmployee = async (payload: Advisor): Promise<Advisor> => {
  try {
    const response = await axios.put<Advisor>(
      "https://project-service.kunmhing.me/api/v1/staffs",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          "accept": "application/json",
        },
      }
    );
    console.log("putUpdateEmployee",response.data)
    return response.data;
  } catch (error) {
    console.error("Error updating employee:", error);
    throw error;
  }
};

export default putUpdateEmployee;
