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
    abbreviation: string;
    program_name_th: string;
    program_name_en: string | null;
  };
  program_id: number;
}

export interface Employee {
  id: number;
  prefixTH: string | null;
  prefixEN: string | null;
  firstNameTH: string | null;
  lastNameTH: string | null;
  firstNameEN: string | null;
  email: string;
  program: {
    id: number;
    abbreviation: string;
    program_name_th: string;
    program_name_en: string | null;
  };
  program_id: number;
  projectRole: {
    id: number;
    roleNameTH: string;
    roleNameEN: string;
  };
}

export interface Member {
  id: string;
  studentId: string;
  secLab: string;
  firstName: string;
  lastName: string;
  email: string;
  semester: number;
  academic_year: number;
  course_id: number;
  course: Course;
  program_id: number;
  program: {
    id: number;
    abbreviation: string;
    program_name_th: string;
    program_name_en: string | null;
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
  projectNo: string;
  titleTH: string;
  titleEN: string | null;
  abstractText: string;
  academicYear: number;
  semester: number;
  sectionId: string;
  program: {
    id: number;
    abbreviation: string;
    program_name_th: string;
    program_name_en: string | null;
  };
  programId: number;
  courseId: number;
  course: Course;
  staffs: Employee[];
  members: Member[];
  projectResources: ProjectResource[];
  createdAt: string;
  updated_at?: string | null;
}
