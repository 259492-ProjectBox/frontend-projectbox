// models/Project.ts

export interface Major {
    id: number;
    major_name: string;
  }
  
  export interface Course {
    id: number;
    course_no: string;
    course_name: string;
    major_id: number;
    major: Major;
  }
  
  export interface Employee {
    id: number;
    prefix: string;
    first_name: string;
    last_name: string;
    email: string;
    major_id: number;
    major: Major;
    projects: null | string;
  }
  
  export interface Member {
    id: string;
    prefix: string;
    first_name: string;
    last_name: string;
    email: string;
    major_id: number;
    major: Major;
  }
  
  export interface ResourceType {
    id: number;
    mime_type: string;
  }
  
  export interface Resource {
    id: number;
    title: string;
    resource_name: string;
    path: string;
    created_at: string;
    pdf: null | string;
    resource_type_id: number;
    resource_type: ResourceType;
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
    is_approved: boolean;
    created_at: string;
    section_id: string;
    major_id: number;
    major: Major;
    course_id: number;
    course: Course;
    employees: Employee[];
    members: Member[];
    project_resources: ProjectResource[];
  }
  