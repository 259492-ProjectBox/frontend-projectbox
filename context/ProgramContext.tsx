"use client";
import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { AllProgram } from "@/models/AllPrograms";
import { getProgramOptions } from "@/utils/programHelpers";
import { useAuth } from "@/hooks/useAuth";

interface ProgramContextType {
  selectedMajor: number;
  setSelectedMajor: (id: number) => void;
  options: AllProgram[];
  loading: boolean;
}

const ProgramContext = createContext<ProgramContextType | undefined>(undefined);

export const ProgramProvider = ({ children }: { children: ReactNode }) => {
  const [selectedMajor, setSelectedMajor] = useState<number>(0);
  const [options, setOptions] = useState<AllProgram[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOptions = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const programOptions = await getProgramOptions(user.isAdmin);
        setOptions(programOptions);

        // Check if there's a saved selection in localStorage
        const savedMajor = localStorage.getItem("selectedMajor");
        if (savedMajor) {
          const majorId = Number(savedMajor);
          // Ensure the saved major exists in the options
          if (programOptions.some(option => option.id === majorId)) {
            setSelectedMajor(majorId);
          } else {
            setSelectedMajor(0);
            localStorage.removeItem("selectedMajor");
          }
        }
      } catch (err) {
        console.error("Error fetching program options:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, [user]);

  const handleSetSelectedMajor = (id: number) => {
    setSelectedMajor(id);
    localStorage.setItem("selectedMajor", id.toString());
  };

  return (
    <ProgramContext.Provider
      value={{
        selectedMajor,
        setSelectedMajor: handleSetSelectedMajor,
        options,
        loading
      }}
    >
      {children}
    </ProgramContext.Provider>
  );
};

export const useProgram = (): ProgramContextType => {
  const context = useContext(ProgramContext);
  if (context === undefined) {
    throw new Error("useProgram must be used within a ProgramProvider");
  }
  return context;
};
