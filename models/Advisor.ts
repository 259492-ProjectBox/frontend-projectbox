// models/Advisor.ts

export interface Advisor {
  id: number;
  prefix: string;
  first_name: string;
  last_name: string;
  email: string;
  program_id: number; // Changed from major_id to program_id
}
