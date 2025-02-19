export interface ProjectResourceConfig {
  id?: number;
  icon_name: string;
  is_active: boolean;
  program_id: number;
  resource_type_id: number;
  title: string;
  resource_type: {
    id: number;
    type_name: string;
  };
  program: {
    id: number;
    program_name_th: string;
    program_name_en: string;
    abbreviation: string;
  };
  icon_url: string;
}
