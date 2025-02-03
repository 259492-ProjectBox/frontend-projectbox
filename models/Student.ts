export interface Program {
  id: number;
  program_name_th: string;
  program_name_en: string;
  abbreviation: string;
}

export interface Course {
  id: number;
  course_no: string;
  course_name: string;
  program_id: number;
  program: Program;
}

export interface Student {
  id: number;
  student_id: string;
  sec_lab: string;
  first_name: string;
  last_name: string;
  email: string;
  semester: number;
  academic_year: number;
  course_id: number;
  course: Course;
  program_id: number;
  program: Program;
  created_at: string;
}
