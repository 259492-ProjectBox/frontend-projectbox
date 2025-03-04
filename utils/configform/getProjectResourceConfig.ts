// src/utils/apiController.ts
import axios from "axios";

export const getProjectResourceConfig = async (programId: number) : Promise<any> => {
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
  
    return response.data; // Axios returns data in the `data` property of the response
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Rethrow error to handle it in the component
  }
};
