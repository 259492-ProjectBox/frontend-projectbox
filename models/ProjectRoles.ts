export interface Program {
  id: number;
  program_name_th: string;
  program_name_en: string;
  abbreviation: string;
}

export interface ProjectRole {
  id: number;
  role_name_th: string;
  role_name_en: string;
  program: Program;
  program_id: number;
}
