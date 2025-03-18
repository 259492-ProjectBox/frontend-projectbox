// Centralized API configuration

import { Delete } from "@mui/icons-material";

// const PROJECT_SERVICE_URL = "https://project-service.kunmhing.me" ;
// const SEARCH_SERVICE_URL = "https://search-service.kunmhing.me";
// const AUTH_SERVICE_URL = "https://auth-service.kunmhing.me";

const PROJECT_SERVICE_URL = process.env.PROJECT_SERVICE_URL  ;
const SEARCH_SERVICE_URL = process.env.SEARCH_SERVICE_URL;
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL ;

export const apiConfig = {
    // Project Service
    
    ProjectService: {
      // Programs
      Programs: `${PROJECT_SERVICE_URL}/api/v1/programs`,
      ProgramById: (id: number) => `${PROJECT_SERVICE_URL}/api/v1/programs/${id}`,
  
      // Staffs/Employees/Advisors
      Staffs: `${PROJECT_SERVICE_URL}/api/v1/staffs`,
      StaffById: (id: string) => `${PROJECT_SERVICE_URL}/api/v1/staffs/${id}`,
      StaffByEmail: (email: string) => `${PROJECT_SERVICE_URL}/api/v1/staffs/email/${email}`,
      StaffsByProgram: (id: number) => `${PROJECT_SERVICE_URL}/api/v1/staffs/program/${id}`,
      AllStaffs: `${PROJECT_SERVICE_URL}/api/v1/staffs/GetAllStaffs`,
  
      // Students
      Students: `${PROJECT_SERVICE_URL}/api/v1/students`,
      StudentById: (id: string) => `${PROJECT_SERVICE_URL}/api/v1/students/${id}`,
      StudentsByProgram: (id: number) => `${PROJECT_SERVICE_URL}/api/v1/students/program/${id}`,
      StudentsByProgramCurrentYear: (id: number) =>
        `${PROJECT_SERVICE_URL}/api/v1/students/program/${id}/current_year`,
      CheckStudentPermission: (id: string) => `${PROJECT_SERVICE_URL}/api/v1/students/${id}/check`,
  
      // Project Configs
      ProjectConfigs: `${PROJECT_SERVICE_URL}/api/v1/projectConfigs`,
      ProjectConfigsByProgram: (id: number) => `${PROJECT_SERVICE_URL}/api/v1/projectConfigs/program/${id}`,
  
      // Project Resource Configs
      ProjectResourceConfigsV1: `${PROJECT_SERVICE_URL}/api/v1/projectResourceConfigs`,
      ProjectResourceConfigsV2: `${PROJECT_SERVICE_URL}/api/v2/projectResourceConfigs`,
      ProjectResourceConfigsByProgramV1: (id: number) =>
        `${PROJECT_SERVICE_URL}/api/v1/projectResourceConfigs/program/${id}`,
      ProjectResourceConfigsByProgramV2: (id: number) =>
        `${PROJECT_SERVICE_URL}/api/v2/projectResourceConfigs/program/${id}`,
      ProjectResourceConfigByIdV1: (id: number) =>
        `${PROJECT_SERVICE_URL}/api/v1/projectResourceConfigs/${id}`,
  
      // Program Configs
      Configs: `${PROJECT_SERVICE_URL}/api/v1/configs`,
      ConfigsByProgram: (id: number) => `${PROJECT_SERVICE_URL}/api/v1/configs/program/${id}`,
      AcademicYears: `${PROJECT_SERVICE_URL}/api/v1/configs/academic-years`,
  
      // Project Roles
      ProjectRolesByProgram: (id: number) => `${PROJECT_SERVICE_URL}/api/v1/projectRoles/program/${id}`,
  
      //Project 
      UpdateProjects: `${PROJECT_SERVICE_URL}/api/v1/projects`,
      CreateProject: `${PROJECT_SERVICE_URL}/api/v1/projects`,
      
      // Uploads
      UploadStudentEnrollment: (id: number) =>
        `${PROJECT_SERVICE_URL}/api/v1/uploads/program/${id}/student-enrollment`,
      UploadCreateProject: (id: number) =>
        `${PROJECT_SERVICE_URL}/api/v1/uploads/program/${id}/create-project`,
      UploadCreateStaff: (id: number) => `${PROJECT_SERVICE_URL}/api/v1/uploads/program/${id}/create-staff`,
  
      // Calendar
      Calendar: `${PROJECT_SERVICE_URL}/calendar`,
      CalendarByMajorId: (id: number) => `${PROJECT_SERVICE_URL}/calendar/GetByMajorID/${id}`,

      
      //Keywords 
      GetAllKeyWord: `${PROJECT_SERVICE_URL}/api/v1/keywords/all`,
      GetKeywordByProgramID : (id: number) => `${PROJECT_SERVICE_URL}/api/v1/keywords?program_id=${id}`,
      GETKeywordByID : (id: number) => `${PROJECT_SERVICE_URL}/api/v1/keywords/${id}`,
      CreateKeyword : `${PROJECT_SERVICE_URL}/api/v1/keywords`,
      UpdateKeyword : (id: number) => `${PROJECT_SERVICE_URL}/api/v1/keywords/${id}`,
      DeleteKeyword : (id: number) => `${PROJECT_SERVICE_URL}/api/v1/keywords/${id}`,

    },
  
    // Search Service
    SearchService: {
      // Projects
      Projects: `${SEARCH_SERVICE_URL}/api/v1/projects`,
      ProjectById: (id: number) => `${SEARCH_SERVICE_URL}/api/v1/projects/${id}`,
      ProjectContent: `${SEARCH_SERVICE_URL}/api/v1/projects/content`,
      ProjectAllFields: `${SEARCH_SERVICE_URL}/api/v1/projects/all-fields`,
      ProjectSelectedFields: `${SEARCH_SERVICE_URL}/api/v1/projects/selected-fields`,
    },
  
    // Auth Service
    AuthService: {
      // Admin Management
      GetAdmin: `${AUTH_SERVICE_URL}/api/getAdmin`,
      CreateAdmin: `${AUTH_SERVICE_URL}/createAdmin`,
      RemoveAdmin: `${AUTH_SERVICE_URL}/removeAdmin`,
  
      // Authentication
      BaseURL: AUTH_SERVICE_URL,
    },
  }

