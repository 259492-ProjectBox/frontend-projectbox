import { ConfigProgramSetting } from "@/models/ConfigProgram";
import axios from "axios";

export const updateConfigProgram = async (config: ConfigProgramSetting) => {
    try {
      const response = await axios.put('https://project-service.kunmhing.me/api/v1/configs', config, {
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating config program:', error);
      throw error;
    }
  };