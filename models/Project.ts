export interface Major {
  id: number;
  major_name: string;
}

export interface Course {
  id: number;
  course_no: string;
  course_name: string;
  program: {
    id: number;
    program_name_th: string;
    program_name_en: string;
  };
  program_id: number;
}

export interface Employee {
  id: number;
  prefix: string;
  first_name: string;
  last_name: string;
  email: string;
  program: {
    id: number;
    program_name_th: string;
    program_name_en: string;
  };
  program_id: number;
  projects: null | string;
}

export interface Member {
  id: string;
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
  program: {
    id: number;
    program_name_th: string;
    program_name_en: string;
  };
}

export interface ResourceType {
  id: number;
  type_name: string;
}

export interface Resource {
  id: number;
  title: string | null;
  resource_name: string | null;
  path: string | null;
  pdf: null | string;
  resource_type_id: number;
  resource_type: ResourceType;
  created_at: string | null;
  url?: string | null;
  file_extension_id?: number | null;
  file_extension?: string | null;
}

export interface ProjectResource {
  id: number;
  resource: Resource;
}

export interface Project {
  id: number;
  project_no: string;
  title_th: string;
  title_en: string;
  abstract_text: string;
  academic_year: number;
  semester: number;
  section_id: string;
  program: {
    id: number;
    program_name_th: string;
    program_name_en: string;
  };
  program_id: number;
  course_id: number;
  course: Course;
  staffs: Employee[];
  members: Member[];
  project_resources: ProjectResource[];
  created_at: string;
  updated_at?: string | null;
}
