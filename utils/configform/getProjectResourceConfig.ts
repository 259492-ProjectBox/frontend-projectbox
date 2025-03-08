// src/utils/apiController.ts
import { ProjectResourceConfig } from "@/models/ProjectResourceConfig";
import axios from "axios";

export const getProjectResourceConfig = async (programId: number) : Promise<ProjectResourceConfig[]> => {
  try {
    const response = await axios.get(
      `https://project-service.kunmhing.me/api/v1/projectResourceConfigs/program/${programId}`,
      {
        headers: {
          accept: "application/json",
        },
      }
    );
    console.log("getProjectResourceConfig", response.data);

    // Ensure the response data is valid
    if (response.data) {
      return response.data;
    } else {
      throw new Error("Invalid response data");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Rethrow error to handle it in the component
  }
};
