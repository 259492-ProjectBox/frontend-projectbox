// src/hooks/useConfigData.ts
import { ConfigProgramSetting } from "@/models/ConfigProgram";

export const getConfigProgram = async (programId: number): Promise<ConfigProgramSetting[]> => {
  try {
    const response = await fetch(`https://project-service.kunmhing.me/api/v1/configs/program/${programId}`, {
      method: 'GET',
      headers: {
        'accept': 'application/json'
      }
    });
    const data: ConfigProgramSetting[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

