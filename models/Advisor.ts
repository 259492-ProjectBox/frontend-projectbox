// models/Advisor.ts

export interface Advisor {
  id: number;
  prefix_en: string;
  prefix_th: string;
  first_name_en: string;
  first_name_th: string;
  last_name_en: string;
  last_name_th: string;
  email: string;
  program_id: number;
  is_resigned : boolean;
}
