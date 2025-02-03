// src/helpers/programHelpers.ts

import { AllProgram } from "@/models/AllPrograms";
import getAllProgram from "./getAllProgram";

// Helper function to map program IDs to their English program names
const getProgramNameById = (programId: number, programs: AllProgram[]): string | undefined => {
  const program = programs.find((prog) => prog.id === programId);
  return program ? program.program_name_en : undefined; // Return program name in English if found, otherwise undefined
};

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

export { getProgramNameById, getProgramIdByName, getProgramName, getProgramId };
