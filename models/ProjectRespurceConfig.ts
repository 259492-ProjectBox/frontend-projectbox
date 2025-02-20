export interface ProjectResourceConfig {
  icon_name: string;
  id: number;
  is_active: boolean;
  program: {
    abbreviation: string;
    id: number;
    program_name_en: string;
    program_name_th: string;
  };
  program_id: number;
  resource_type: {
    id: number;
    type_name: string;
  };
  resource_type_id: number;
  title: string;
  icon_url: string;
}
