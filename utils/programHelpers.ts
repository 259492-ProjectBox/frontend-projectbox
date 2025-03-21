// src/helpers/programHelpers.ts

import { AllProgram } from "@/models/AllPrograms";
import getAllProgram from "./getAllProgram";

// Helper function to map program IDs to their English program names
const getProgramNameById = (programId: number, programs: AllProgram[]): string | undefined => {
  const program = programs.find((prog) => prog.id === programId);
  return program ? program.program_name_en : undefined; // Return program name in English if found, otherwise undefined
};
const getProgramAbbreviationById = (programId: number, programs: AllProgram[]): string | undefined => {
  const program = programs.find((prog) => prog.id === programId);
  return program ? program.abbreviation : undefined; // Return program name in English if found, otherwise undefined
}

// Helper function to map program names to their IDs
const getProgramIdByName = (programName: string, programs: AllProgram[]): number | undefined => {
  const program = programs.find((prog) => prog.program_name_en === programName);
  return program ? program.id : undefined; // Return program ID if found, otherwise undefined
};

// Example usage: Fetching program name by ID
const getProgramName = async (programId: number): Promise<string | undefined> => {
  try {
    const programs = await getAllProgram(); // Fetch the programs from API
    const programName = getProgramNameById(programId, programs);
    return programName;
  } catch (error) {
    console.error('Error getting program name:', error);
    return undefined;
  }
};

// Example usage: Fetching program ID by name
const getProgramId = async (programName: string): Promise<number | undefined> => {
  try {
    const programs = await getAllProgram(); // Fetch the programs from API
    const programId = getProgramIdByName(programName, programs);
    return programId;
  } catch (error) {
    console.error('Error getting program ID:', error);
    return undefined;
  }
};
export const getProgramOptions = async (isAdmin: number[]): Promise<AllProgram[]> => {
  const allPrograms: AllProgram[] = await getAllProgram(); // Fetch all programs

  // Filter only programs that exist in isAdmin
  const validPrograms = allPrograms.filter((program) => isAdmin.includes(program.id));

  return [
    { id: 0, program_name_en: "Select Program", program_name_th: "เลือกหลักสูตร", abbreviation: "" }, // Default option
    ...validPrograms.sort((a, b) => a.id - b.id), // Sort by ID for consistency
  ];
};

export { getProgramNameById, getProgramIdByName, getProgramName, getProgramId ,getProgramAbbreviationById };
