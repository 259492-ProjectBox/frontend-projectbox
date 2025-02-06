"use client";
import { AllProgram } from "@/models/AllPrograms";
import getAllProgram from "@/utils/getAllProgram";
import postCreateProgram from "@/utils/platformadmin/postCreateProgram";
import { getAdmins } from "@/utils/superadmin/getAdmin";
import { createAdmin } from "@/utils/superadmin/createAdmin"; // Import the createAdmin function
import { deleteAdmin } from "@/utils/superadmin/deleteAdmin"; // Import the deleteAdmin function
import { useAuth } from "@/hooks/useAuth"; // Importing useAuth hook
import React, { useEffect, useState } from "react";
import Select, { MultiValue } from "react-select"; // Importing MultiValue from react-select
import { getProgramAbbreviationById, getProgramNameById } from "@/utils/programHelpers"; // Import the helper function to get program name by ID
  
type ProgramOption = {
  value: number;
  label: string;
};

type Admin = {
  email: string;
  nameEn: string;
  nameTh: string;
  programs: string;
  programIds: number[];
};

type FetchedAdmin = {
  cmuaccount: string;
  firstnameen: string;
  lastnameen: string;
  firstnameth: string;
  lastnameth: string;
  programs_ids: number[];
};

const programColors: Record<number, { bg: string; text: string }> = {
  1: { bg: "bg-[#F8D7DA]", text: "text-[#8B0000]" },
  2: { bg: "bg-[#F3E5F5]", text: "text-[#6A1B9A]" },
  3: { bg: "bg-[#E8F5E9]", text: "text-[#1B5E20]" },
  4: { bg: "bg-[#FFEBEE]", text: "text-[#B71C1C]" },
  5: { bg: "bg-[#E0F2F1]", text: "text-[#004D40]" },
  6: { bg: "bg-[#FFFDE7]", text: "text-[#F57F17]" },
  7: { bg: "bg-[#F3E5F5]", text: "text-[#4A148C]" },
  8: { bg: "bg-[#FFF3E0]", text: "text-[#E65100]" },
  9: { bg: "bg-[#E3F2FD]", text: "text-[#0D47A1]" },
  10: { bg: "bg-[#E8EAF6]", text: "text-[#1A237E]" },
  11: { bg: "bg-[#F8D7DA]", text: "text-[#8B0000]" },
  12: { bg: "bg-[#E0F7FA]", text: "text-[#006064]" },
};

export default function AdminManagePage(): JSX.Element {
  const { user } = useAuth(); // Get user from the auth context (assumed to be available in your app)
  const [admins, setAdmins] = useState<Admin[]>([]); // Hold admins data
  const [filteredAdmins, setFilteredAdmins] = useState<Admin[]>([]); // Hold filtered admins based on selected program
  const [email, setEmail] = useState<string>(""); // For email input (Admin's email)
  const [programs, setPrograms] = useState<AllProgram[]>([]); // To hold the programs fetched from API
  const [selectedProgram, setSelectedProgram] = useState<ProgramOption | null>({value: 0,
    label: "Select Program",}); // Selected program for filtering
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedPrograms, setSelectedPrograms] = useState<MultiValue<ProgramOption>>([]); // Correct type for selected programs
  const [newProgramEn, setNewProgramEn] = useState<string>(""); // State for new program name (English)
  const [newProgramTh, setNewProgramTh] = useState<string>(""); // State for new program name (Thai)
  const [newAbbreviation, setNewAbbreviation] = useState<string>(""); // State for new program abbreviation
  const [isProgramModalOpen, setIsProgramModalOpen] = useState<boolean>(false); // State for program modal visibility
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false); // State for delete modal visibility
  const [adminToDelete, setAdminToDelete] = useState<Admin | null>(null); // Admin to be deleted
  const [searchTerm, setSearchTerm] = useState<string>(""); // State for search term

  // Fetching admin data from the API using the controller
  const loadAdmins = async () => {
    try {
      const fetchedAdmins: FetchedAdmin[] = await getAdmins();
      const adminsWithPrograms = fetchedAdmins.map((admin) => ({
        email: admin.cmuaccount,
        nameEn: `${admin.firstnameen} ${admin.lastnameen}`,
        nameTh: `${admin.firstnameth} ${admin.lastnameth}`,
        programs: admin.programs_ids.map((id) => getProgramNameById(id, programs)).join(", "),
        programIds: admin.programs_ids, // Store program IDs for filtering
      }));
      setAdmins(adminsWithPrograms);
      setFilteredAdmins(adminsWithPrograms); // Initially, show all admins
    } catch (error) {
      console.error("Error loading admins:", error);
    }
  };

  useEffect(() => {
    loadAdmins();
  }, [programs]); // Depend on programs to ensure they are loaded before mapping

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

  // Filter admins based on search term and selected program
  useEffect(() => {
    const filtered = admins.filter((admin) => {
      const matchesSearchTerm =
        admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.nameTh.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesProgram =
        !selectedProgram || selectedProgram.value === -1 || admin.programIds.includes(selectedProgram.value);

      return matchesSearchTerm && matchesProgram;
    });

    setFilteredAdmins(filtered);
  }, [searchTerm, selectedProgram, admins]);

  // Filter admins based on selected program
  const handleFilterProgramChange = (selectedOption: ProgramOption | null) => {
    setSelectedProgram(selectedOption);
  
    if (!selectedOption || selectedOption.value === 0) {
      // If "Select Program" is chosen, do nothing (keep all admins)
      setFilteredAdmins(admins);
      return;
    }
  
    if (selectedOption.value === -1) {
      // If "All Programs" is chosen, show all admins
      setFilteredAdmins(admins);
      return;
    }
  
    // Otherwise, filter admins based on selected program
    const filtered = admins.filter((admin) =>
      admin.programIds.includes(selectedOption.value)
    );
    setFilteredAdmins(filtered);
  };
  
  // Handle admin deletion
  const handleDeleteAdmin = async () => {
    const adminAccount = user?.cmuAccount; // Use user.cmuAccount for the adminAccount

    if (adminAccount && adminToDelete) {
      try {
        // Call the deleteAdmin function from the controller
        await deleteAdmin(adminToDelete.email, adminAccount);

        // Update the UI after deleting the admin
        const updatedAdmins = admins.filter((admin) => admin.email !== adminToDelete.email);
        setAdmins(updatedAdmins);
        setFilteredAdmins(updatedAdmins);
        setIsDeleteModalOpen(false); // Close the delete modal
        setAdminToDelete(null); // Clear the admin to delete
        alert("Admin deleted successfully!");
      } catch (error) {
        console.error("Error deleting admin:", error);
        alert("Failed to delete admin.");
      }
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
        
        // Fetch the updated admin list
        await loadAdmins();
        
        // Clear the form
        setEmail(""); // Clear the email field after adding
        setSelectedPrograms([]); // Clear the selected programs after adding
        setIsModalOpen(false); // Close the modal
        alert("Admin added successfully!");
      } catch (error) {
        console.error("Error adding admin:", error);
        alert("Failed to add admin.");
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
          abbreviation: newAbbreviation,
          
        });

        setPrograms([
          ...programs,
          createdProgram, // Add the newly created program to the list
        ]);

        setNewProgramEn(""); // Clear input after adding
        setNewProgramTh(""); // Clear input after adding
        setNewAbbreviation(""); // Clear input after adding
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
        <div className="mb-4 flex gap-2">
          <input
            type="text"
            placeholder="Search by CMU Account or Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-4/12 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-800 text-sm"
          />
          <Select
            value={selectedProgram}
            onChange={handleFilterProgramChange}
            options={[
              { value: 0, label: "Select Program" }, // Default selection
              { value: -1, label: "All Programs" },  // GetAll option
              ...programs.map((program) => ({
                value: program.id,
                label: program.program_name_en,
              })),
            ]}
            className="w-4/12"
            placeholder="Filter by Program"
        />
        </div>

        <div className="relative overflow-x-auto shadow-md sm:rounded-lg max-h-96 overflow-y-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">CMU Account</th>
                <th scope="col" className="px-6 py-3">Name</th>
                <th scope="col" className="px-6 py-3">Program</th>
                <th scope="col" className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdmins.map((item) => (
                <tr key={item.email} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{item.email}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {item.nameEn}
                    <br />
                    <span className="text-gray-500">{item.nameTh}</span>
                  </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                    {item.programIds.map((programId) => {
                      const colorTheme = programColors[programId] || { bg: "bg-gray-300", text: "text-gray-700" };
                      return (
                      <div
                        key={programId}
                        className={`inline-block px-2 py-1 rounded-full text-xs font-semibold mr-2 mb-1 ${colorTheme.bg} ${colorTheme.text}`}
                      >
                        {getProgramAbbreviationById(programId, programs)}
                      </div>
                      );
                    })}
                    </td>
                  <td className="px-6 py-4 font-medium text-red-600 cursor-pointer" onClick={() => { setAdminToDelete(item); setIsDeleteModalOpen(true); }}>
                    Delete
                  </td>
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
              <h3 className="mb-5 text-lg font-medium text-gray-800">Add Admin to Program</h3>
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

      {/* Delete Admin Modal */}
      {isDeleteModalOpen && adminToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6 text-center">
              <button type="button" className="text-gray-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center" onClick={() => setIsDeleteModalOpen(false)}>
                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                <span className="sr-only">Close modal</span>
              </button>
              <svg className="text-gray-400 w-11 h-11 mb-3.5 mx-auto" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
              <p className="mb-4 text-gray-500">Are you sure you want to delete this admin?</p>
              <p className="mb-4 text-gray-500">{adminToDelete.nameEn} ({adminToDelete.nameTh})</p>
              <p className="mb-4 text-gray-500">{adminToDelete.email}</p>
              <p className="mb-4 text-red-600">Delete will remove admin of all programs including </p>
                <div className="mb-4 p-2 border border-red-300 rounded">
                  {adminToDelete.programs.split(", ").map((program: string, index: number) => (
                  <p key={index} className="text-gray-500">{program}</p>
                  ))}
                </div>
              <div className="flex justify-center items-center space-x-4">
                <button onClick={() => setIsDeleteModalOpen(false)} type="button" className="py-2 px-3 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10">
                  No, cancel
                </button>
                <button onClick={handleDeleteAdmin} type="button" className="py-2 px-3 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300">
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manage Program Section */}
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-lg font-semibold text-gray-800">Program Names</h1>
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
                <th scope="col" className="px-6 py-3">Abbreviation</th>
              </tr>
            </thead>
            <tbody>
              {programs.map((program , index) => (
                <tr key={program.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{index + 1}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{program.program_name_en}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{program.program_name_th}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{program.abbreviation}</td>
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
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Abbrevaition ex. CPE"
                  value={newAbbreviation}
                  onChange={(e) => setNewAbbreviation(e.target.value)}
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
