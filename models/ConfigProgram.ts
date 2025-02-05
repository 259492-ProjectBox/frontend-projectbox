// src/models/ConfigData.ts

export interface ConfigProgramSetting {
  id: number;
  config_name: string;
  value: string;
  program: {
    id: number;
    program_name_th: string;
    program_name_en: string;
    abbreviation: string;
  };
  program_id: number;
}
