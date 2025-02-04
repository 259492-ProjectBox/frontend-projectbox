export interface Course {
  id: number;
  course_no: string;
  course_name: string;
  program_id: number;
  program: {
    id: number;
    program_name_th: string;
    program_name_en: string;
    abbreviation: string;
  };
}