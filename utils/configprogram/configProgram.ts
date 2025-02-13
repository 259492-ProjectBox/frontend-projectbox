// src/hooks/useConfigData.ts
import { ConfigProgramSetting } from "@/models/ConfigProgram";
import axios from 'axios';

export const getConfigProgram = async (programId: number): Promise<ConfigProgramSetting[]> => {
  try {
    const response = await axios.get(`https://project-service.kunmhing.me/api/v1/configs/program/${programId}`, {
      headers: {
        'accept': 'application/json'
      }
    });
    const data: ConfigProgramSetting[] = response.data;
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

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

