import axios from "axios";

// Define the search payload interface for type checking
interface QuickSearchPayload {
  searchInput: string;
  fields: string[];
}

// Define the interface for Project
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
  course: {
    id: number;
    course_no: string;
    course_name: string;
    program: {
      id: number;
      program_name_th: string;
      program_name_en: string;
    };
    program_id: number;
  };
  staffs: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    program: {
      id: number;
      program_name_th: string;
      program_name_en: string;
    };
    program_id: number;
  }[];
  members: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  }[];
  project_resources: {
    id: number;
    resource: {
      id: number;
      title: string | null;
      resource_name: string | null;
      path: string | null;
      pdf: null | string;
      resource_type_id: number;
      resource_type: {
        id: number;
        type_name: string;
      };
      created_at: string | null;
      url?: string | null;
      file_extension_id?: number | null;
      file_extension?: string | null;
    };
  }[];
  created_at: string;
  updated_at?: string | null;
}

// Function to search projects for quick search mode
const quickSearchProjects = async ({ searchInput, fields }: QuickSearchPayload): Promise<Project[]> => {
  try {
    const response = await axios.get(
      `https://project-service.kunmhing.me/api/v1/projects/fields`,
      {
        params: {
          searchInput,
          fields,
        },
        headers: {
          "Content-Type": "application/json",
          "accept": "application/json",
        },
      }
    );
    
    return response.data; // This will return the list of projects based on the search criteria
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error; // Handle error appropriately
  }
};

export default quickSearchProjects;
