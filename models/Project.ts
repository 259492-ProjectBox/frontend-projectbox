export interface Program {
  id: number;
  abbreviation: string;
  programNameTH: string;
  programNameEN: string | null;
}

export interface Course {
  id: number;
  courseNo: string;
  courseName: string;
  programId: number;
  program: Program;
}

export interface ProjectRole {
  id: number;
  roleNameTH: string;
  roleNameEN: string;
}

export interface Employee {
  id: number;
  prefixTH: string | null;
  prefixEN: string | null;
  firstNameTH: string | null;
  lastNameTH: string | null;
  firstNameEN: string | null;
  lastNameEN: string | null;
  email: string;
  programId: number;
  program: Program;
  projectRole: ProjectRole;
}

export interface Member {
  id: string;
  studentId: string;
  secLab: string;
  firstName: string;
  lastName: string;
  email: string;
  semester: number;
  academicYear: number;
  courseId: number;
  course: Course;
  programId: number;
  program: Program;
}

export interface ResourceType {
  id: number;
  typeName: string;
}

export interface Resource {
  id: number;
  title: string | null;
  resourceName: string | null;
  path: string | null;
  url: string | null;
  pdf: string | null;
  resourceTypeId: number;
  resourceType: ResourceType;
  createdAt: string | null;
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
  programId: number;
  program: Program;
  courseId: number;
  course: Course;
  staffs: Employee[];
  members: Member[];
  projectResources: ProjectResource[];
  createdAt: string;
  updated_at?: string | null;
}
