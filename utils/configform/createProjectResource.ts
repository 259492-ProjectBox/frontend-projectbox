import axios from "axios";

const createProjectResource = async (iconFile: File, data: any) => {
  const API_URL = "https://project-service.kunmhing.me/api/v2/projectResourceConfigs";
  const formData = new FormData();
  formData.append("icon", iconFile);
  formData.append("projectResourceConfig", JSON.stringify(data));

  try {
    const response = await axios.put(API_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating project resource:", error);
    throw error;
  }
};

export default createProjectResource;
