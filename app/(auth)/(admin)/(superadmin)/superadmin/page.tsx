"use client";
import { AllProgram } from "@/models/AllPrograms";
import getAllProgram from "@/utils/getAllProgram";
import postCreateProgram from "@/utils/platformadmin/postCreateProgram";
import React, { useEffect, useState } from "react";
import Select, { MultiValue } from "react-select"; // Importing MultiValue from react-select

type Admin = {
  id: number;
  email: string;
  program: string;
};

type ProgramOption = {
  value: number;
  label: string;
};

export default function AdminManagePage(): JSX.Element {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [email, setEmail] = useState<string>("");
  const [programs, setPrograms] = useState<AllProgram[]>([]); // To hold the programs fetched from API
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [selectedPrograms, setSelectedPrograms] = useState<MultiValue<ProgramOption>>([]); // Correct type for selected programs
  const [newProgramEn, setNewProgramEn] = useState<string>(""); // State for new program name (English)
  const [newProgramTh, setNewProgramTh] = useState<string>(""); // State for new program name (Thai)
  const [isProgramModalOpen, setIsProgramModalOpen] = useState<boolean>(false); // State for program modal visibility

  // Fetching admin data (mock data used here)
  useEffect(() => {
    setAdmins([
      { id: 1, email: "admin1@cmu.ac.th", program: "Program 1" },
      { id: 2, email: "admin2@cmu.ac.th", program: "Program 2" },
    ]);
  }, []);

    // Function to fetch programs
    const fetchPrograms = async () => {
      try {
        const programData = await getAllProgram(); // Call your imported getAllProgram API function
        const sortedPrograms = programData.sort((a, b) => a.id - b.id); // Sort programs by ID in ascending order
        setPrograms(sortedPrograms); // Set the sorted programs
      } catch (error) {
        console.error("Error fetching programs:", error);
      }
    };
  
    // Fetch programs when the page loads (not only when the modal opens)
    useEffect(() => {
      fetchPrograms(); // This runs once when the component mounts
    }, []); 

  const handleAddAdmin = () => {
    if (email && selectedPrograms.length > 0) {
      selectedPrograms.forEach((program: ProgramOption) => {
        setAdmins([
          ...admins,
          { id: admins.length + 1, email, program: program.label },
        ]);
      });
      setEmail("");
      setSelectedPrograms([]); // Clear the selected programs after adding
      setIsModalOpen(false);
    }
  };

  const handleDeleteClick = (admin: Admin) => {
    setSelectedAdmin(admin);
  };

  const handleConfirmDelete = () => {
    if (selectedAdmin) {
      setAdmins(admins.filter((admin) => admin.id !== selectedAdmin.id));
      setSelectedAdmin(null);
    }
  };

  const handleAddProgram = async () => {
    if (newProgramEn && newProgramTh) {
      try {
        const createdProgram = await postCreateProgram({
          program_name_en: newProgramEn,
          program_name_th: newProgramTh,
        });

        setPrograms([
          ...programs,
          createdProgram, // Add the newly created program to the list
        ]);

        setNewProgramEn(""); // Clear input after adding
        setNewProgramTh(""); // Clear input after adding
        setIsProgramModalOpen(false); // Close the modal
        fetchPrograms(); // Call fetchPrograms after adding a new program
      } catch (error) {
        console.error("Error creating program:", error);
      }
    } else {
      alert("Please provide both English and Thai program names.");
    }
  };

  const handleDeleteProgram = (programId: number) => {
    setPrograms(programs.filter((program) => program.id !== programId));
  };

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      {/* Admin Program Manager Section */}
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-lg font-semibold text-gray-800">
            Admin Program Manager
          </h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-white text-blue-700 font-bold px-6 py-2 rounded shadow-md hover:bg-gray-100 focus:outline-none flex items-center gap-2"
          >
            Add Admin
          </button>
        </div>

        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">ID</th>
                <th scope="col" className="px-6 py-3">CMU Account</th>
                <th scope="col" className="px-6 py-3">Program</th>
                {/* <th scope="col" className="px-3 py-3 text-center w-24">Action</th> */}
              </tr>
            </thead>
            <tbody>
              {admins.map((item) => (
                <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{item.id}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{item.email}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{item.program}</td>
                  {/* <td className="px-3 py-4 text-center">
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => handleDeleteClick(item)}
                    >
                      Delete
                    </button>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manage Program Section */}
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-lg font-semibold text-gray-800">Manage Program</h1>
          <button
            onClick={() => setIsProgramModalOpen(true)}
            className="bg-white text-blue-700 font-bold px-6 py-2 rounded shadow-md hover:bg-gray-100 focus:outline-none flex items-center gap-2"
          >
            Add Program
          </button>
        </div>

        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">ID</th>
                <th scope="col" className="px-6 py-3">Program Name En</th>
                <th scope="col" className="px-6 py-3">Program Name Th</th>
                {/* <th scope="col" className="px-3 py-3 text-center w-24">Action</th> */}
              </tr>
            </thead>
            <tbody>
              {programs.map((program) => (
                <tr key={program.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{program.id}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{program.program_name_en}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{program.program_name_th}</td>
                  {/* <td className="px-3 py-4 text-center">
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => handleDeleteProgram(program.id)}
                    >
                      Delete
                    </button>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Admin Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6">
              <h3 className="mb-5 text-lg font-medium text-gray-800">Add Admin</h3>
              <div className="mb-4">
                <input
                  type="email"
                  placeholder="CMU Account"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-800 text-sm"
                />
              </div>
              <div className="mb-4">
                <Select
                  isMulti
                  value={selectedPrograms}
                  onChange={(newSelectedPrograms: MultiValue<ProgramOption>) =>
                    setSelectedPrograms(newSelectedPrograms)
                  } // Correctly set selected programs
                  options={programs.map((program) => ({
                    value: program.id,
                    label: program.program_name_en,
                  }))}
                  className="w-full"
                />
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleAddAdmin}
                  className="px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-900 text-sm"
                >
                  Add
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="ml-3 px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded hover:bg-gray-300 focus:outline-none text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Program Modal */}
      {isProgramModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6">
              <h3 className="mb-5 text-lg font-medium text-gray-800">Add Program</h3>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Program Name (En)"
                  value={newProgramEn}
                  onChange={(e) => setNewProgramEn(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-800 text-sm"
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Program Name (Th)"
                  value={newProgramTh}
                  onChange={(e) => setNewProgramTh(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-800 text-sm"
                />
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleAddProgram}
                  className="px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-900 text-sm"
                >
                  Add
                </button>
                <button
                  onClick={() => setIsProgramModalOpen(false)}
                  className="ml-3 px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded hover:bg-gray-300 focus:outline-none text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
