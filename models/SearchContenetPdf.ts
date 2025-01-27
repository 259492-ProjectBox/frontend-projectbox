// models/project.ts

export interface PdfPage {
    id: number;
    pdfId: number;
    pageNumber: number;
    content: string;
  }
  
  export interface Pdf {
    id: number;
    resourceId: number;
    pages: PdfPage[];
  }
  
  export interface ResourceType {
    id: number;
    typeName: string;
  }
  
  export interface FileExtension {
    id: number;
    extensionName: string;
    mimeType: string;
  }
  
  export interface Resource {
    id: number;
    title: string;
    resourceName: string | null;
    path: string | null;
    url: string | null;
    pdf: Pdf | null;
    resourceTypeId: number;
    resourceType: ResourceType;
    fileExtensionId?: number | null;
    fileExtension?: FileExtension | null;
    createdAt?: string;
  }
  
  export interface ProjectResource {
    id: number;
    resource: Resource;
  }
  
  export interface Program {
    id: number;
    programNameTH: string | null;
    programNameEng: string | null;
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
    roleName: string;
  }
  
  export interface StaffProgram {
    id: number;
    programNameTH: string | null;
    programNameEng: string | null;
  }
  
  export interface Staff {
    id: number;
    prefix: string;
    firstName: string;
    lastName: string;
    email: string;
    programId: number;
    program: StaffProgram;
    projectRole: ProjectRole;
  }
  
  export interface Member {
    id: string;       // e.g. "640610308"
    firstName: string;
    lastName: string;
    email: string;
  }
  
  export interface Project {
    id: number;
    projectNo: string;
    titleTH: string;
    titleEN: string;
    abstractText: string;
    academicYear: number;
    semester: number;
    sectionId: string;
    programId: number;
    program: Program;
    courseId: number;
    course: Course;
    staffs: Staff[];
    members: Member[];
    projectResources: ProjectResource[];
    createdAt?: string;
    updated_at?: string;
  }
  