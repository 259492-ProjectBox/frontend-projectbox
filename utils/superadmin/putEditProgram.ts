import axios from "axios";
import { Program } from "@/models/Program"; // Import the Program model

type EditProgramData = Omit<Program, "id"> & { id: number };

const putEditProgram = async (data: EditProgramData): Promise<Program> => {
  try {
    const response = await axios.put("https://project-service.kunmhing.me/api/v1/programs", data, {
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error editing program:", error);
    throw error;
  }
};

export default putEditProgram;
