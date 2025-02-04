// src/hooks/useConfigData.ts
import { ConfigProgramSetting } from "@/models/ConfigProgram";
import { useState, useEffect } from "react";

export const useConfigProgram = () => {
  const [configProgram, setConfigProgram] = useState<ConfigProgramSetting[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://project-service.kunmhing.me/api/v1/configs/program/1', {
          method: 'GET',
          headers: {
            'accept': 'application/json'
          }
        });
        const data: ConfigProgramSetting[] = await response.json();
        setConfigProgram(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return configProgram;
};


export async function fetchConfigProgram(programId: number) {
  const res = await fetch(`/api/configProgram?programId=${programId}`, { 
    method: "GET",
    cache: "no-store" // Ensure fresh data
  });

  const data = await res.json();
  if (!data.ok) throw new Error(data.message);

  return data.data;
}

