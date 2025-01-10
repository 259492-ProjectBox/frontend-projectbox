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
  
  export interface Advisor {
    id: number;
    prefix: string;
    first_name: string;
    last_name: string;
    email: string;
  }
  