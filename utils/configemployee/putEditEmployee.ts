// utils/configemployee/postUpdateEmployee.ts
import axios from "axios";
import { Advisor } from "@/models/Advisor";

const putUpdateEmployee = async (advisor: Advisor): Promise<Advisor> => {
  try {
    // console.log("Sending update request for advisor:", advisor);
    const response = await axios.put<Advisor>(
      `https://project-service.kunmhing.me/api/v1/staffs`,
      {
        ...advisor,
      },
      {
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
      }
    );
    // console.log("Received response for update request:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating advisor:", error);
    throw error;
  }
};

export default putUpdateEmployee;
