"use client";
import { AllProgram } from "@/models/AllPrograms";
import getAllProgram from "@/utils/getAllProgram";
import postCreateProgram from "@/utils/platformadmin/postCreateProgram";
import { getAdmins } from "@/utils/superadmin/getAdmin";
import { createAdmin } from "@/utils/superadmin/createAdmin"; // Import the createAdmin function
import { useAuth } from "@/hooks/useAuth"; // Importing useAuth hook
import React, { useEffect, useState } from "react";
import Select, { MultiValue } from "react-select"; // Importing MultiValue from react-select

type ProgramOption = {
  value: number;
  label: string;
};

export default function AdminManagePage(): JSX.Element {
  const { user } = useAuth(); // Get user from the auth context (assumed to be available in your app)
  const [admins, setAdmins] = useState<any[]>([]); // Hold admins data
  const [filteredAdmins, setFilteredAdmins] = useState<any[]>([]); // Hold filtered admins based on selected program
  const [email, setEmail] = useState<string>(""); // For email input (Admin's email)
  const [programs, setPrograms] = useState<AllProgram[]>([]); // To hold the programs fetched from API
  const [selectedProgram, setSelectedProgram] = useState<ProgramOption | null>(null); // Selected program for filtering
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedPrograms, setSelectedPrograms] = useState<MultiValue<ProgramOption>>([]); // Correct type for selected programs
  const [newProgramEn, setNewProgramEn] = useState<string>(""); // State for new program name (English)
  const [newProgramTh, setNewProgramTh] = useState<string>(""); // State for new program name (Thai)
  const [isProgramModalOpen, setIsProgramModalOpen] = useState<boolean>(false); // State for program modal visibility

  // Fetching admin data from the API using the controller
  useEffect(() => {
    const loadAdmins = async () => {
      try {
        const fetchedAdmins = await getAdmins();
        const adminsWithIds = fetchedAdmins.map((admin: any, index: number) => ({
          id: index + 1, // If there is no ID in the response, use the index as a unique ID
          email: admin.email,
          program: admin.program || "No program", // Default value if program is undefined
        }));
        setAdmins(adminsWithIds);
        setFilteredAdmins(adminsWithIds); // Initially, show all admins
      } catch (error) {
        console.error("Error loading admins:", error);
      }
    };

    loadAdmins();
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

  // Filter admins based on selected program
  const handleFilterProgramChange = (selectedOption: ProgramOption | null) => {
    setSelectedProgram(selectedOption);

    // Filter admins based on the selected program
    if (selectedOption && selectedOption.value !== -1) {
      const filtered = admins.filter(
        (admin) => admin.program === selectedOption.label
      );
      setFilteredAdmins(filtered);
    } else {
      setFilteredAdmins(admins); // Show all admins if "All Programs" is selected
    }
  };

  // Handle admin creation
  const handleAddAdmin = async () => {
    const adminAccount = user?.cmuAccount; // Use user.cmuAccount for the adminAccount
    const userAccount = email; // userAccount is entered by the user in the input field

    if (adminAccount && userAccount && selectedPrograms.length > 0) {
      const programIds = selectedPrograms.map((program: ProgramOption) => program.value); // Get program IDs

      try {
        // Call the createAdmin function from the controller
        await createAdmin(userAccount, adminAccount, programIds); // Use userAccount for the new admin and adminAccount for the current user
        
        // Update the UI after creating the admin
        setAdmins([
          ...admins,
          {
            id: admins.length + 1,
            email: userAccount,
            program: selectedPrograms.map((program: ProgramOption) => program.label).join(", "),
          },
        ]);
        
        // Clear the form
        setEmail(""); // Clear the email field after adding
        setSelectedPrograms([]); // Clear the selected programs after adding
        setIsModalOpen(false); // Close the modal
      } catch (error) {
        console.error("Error adding admin:", error);
      }
    } else {
      alert("Please fill in all fields and select at least one program.");
    }
  };

  // Handle program creation
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

        {/* Program Filter Dropdown */}
        <div className="mb-4">
          <Select
            value={selectedProgram}
            onChange={handleFilterProgramChange}
            options={[
              { value: -1, label: "All Programs" }, // All Programs option
              ...programs.map((program) => ({
                value: program.id,
                label: program.program_name_en,
              })),
            ]}
            className="w-5/12"
            placeholder="Filter by Program"
          />
        </div>

        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">ID</th>
                <th scope="col" className="px-6 py-3">CMU Account</th>
                <th scope="col" className="px-6 py-3">Program</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdmins.map((item) => (
                <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{item.id}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{item.email}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{item.program}</td>
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
                  placeholder="User Account"
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
              </tr>
            </thead>
            <tbody>
              {programs.map((program) => (
                <tr key={program.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{program.id}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{program.program_name_en}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{program.program_name_th}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
