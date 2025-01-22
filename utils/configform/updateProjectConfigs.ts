import axios from "axios";
import { ProjectConfig } from "@/models/ProjectConfig";

const updateProjectConfigs = async (configs: ProjectConfig[]): Promise<void> => {
  try {
    const response = await axios.put(
      'https://project-service.kunmhing.me/api/v1/projectConfigs',
      configs,
      {
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status !== 200 && response.status !== 204) {
      console.error('Error updating project configs:', response.data);
      throw new Error('Failed to update project configs');
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error during PUT request:', error.response?.data || error.message);
    } else {
      console.error('Unexpected error during PUT request:', error);
    }
    throw error;
  }
};

export default updateProjectConfigs;
