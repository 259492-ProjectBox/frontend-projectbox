import axios from "axios";
import { ProjectResourceConfig } from "@/models/ProjectResourceConfig";

const API_URL = "https://project-service.kunmhing.me/api/v2/projectResourceConfigs";

const updateResourceStatus = async (iconFile: File | null, data: ProjectResourceConfig) => {
  const formData = new FormData();
  if (iconFile) {
    formData.append("icon", iconFile);
  }
  formData.append("projectResourceConfig", JSON.stringify(data));

  try {
    const response = await axios.put(API_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating resource status:", error);
    throw error;
  }
};

export default updateResourceStatus;
