"use client";
import getAllProgram from "@/utils/getAllProgram";
import postCreateProgram from "@/app/api/platformadmin/postCreateProgram";
import { getAdmins } from "@/app/api/superadmin/getAdmin";
import { createAdmin } from "@/app/api/superadmin/createAdmin"; // Import the createAdmin function
import { deleteAdmin } from "@/app/api/superadmin/deleteAdmin"; // Import the deleteAdmin function
import putEditProgram from "@/app/api/superadmin/putEditProgram"; // Import the putEditProgram function
import { useAuth } from "@/hooks/useAuth"; // Importing useAuth hook
import React, { useCallback, useEffect, useState } from "react";
import Select, { MultiValue } from "react-select"; // Importing MultiValue from react-select
import { getProgramAbbreviationById, getProgramNameById } from "@/utils/programHelpers"; // Import the helper function to get program name by ID
import { Program } from "@/models/Program"; // Import the Program model
  
type ProgramOption = {
  value: number;
  label: string;
};

// Color palette generator function
const generateColorPalette = (id: number) => {
  // Predefined color combinations (bg and text colors)
  const colorPalettes = [
    { bg: "bg-red-100", text: "text-red-800" },
    { bg: "bg-purple-100", text: "text-purple-800" },
    { bg: "bg-green-100", text: "text-green-800" },
    { bg: "bg-blue-100", text: "text-blue-800" },
    { bg: "bg-indigo-100", text: "text-indigo-800" },
    { bg: "bg-yellow-100", text: "text-yellow-800" },
    { bg: "bg-pink-100", text: "text-pink-800" },
    { bg: "bg-orange-100", text: "text-orange-800" },
    { bg: "bg-teal-100", text: "text-teal-800" },
    { bg: "bg-cyan-100", text: "text-cyan-800" },
    { bg: "bg-lime-100", text: "text-lime-800" },
    { bg: "bg-emerald-100", text: "text-emerald-800" },
    { bg: "bg-sky-100", text: "text-sky-800" },
    { bg: "bg-violet-100", text: "text-violet-800" },
    { bg: "bg-fuchsia-100", text: "text-fuchsia-800" },
    { bg: "bg-rose-100", text: "text-rose-800" },
  ];

  // Use modulo to cycle through colors if id exceeds array length
  const colorIndex = (id - 1) % colorPalettes.length;
  return colorPalettes[colorIndex];
};

// Replace the old programColors with the new dynamic system
const getColorForProgram = (programId: number) => {
  return generateColorPalette(programId);
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

export default function AdminManagePage(): JSX.Element {
  const { user } = useAuth(); // Get user from the auth context (assumed to be available in your app)
  const [admins, setAdmins] = useState<Admin[]>([]); // Hold admins data
  const [filteredAdmins, setFilteredAdmins] = useState<Admin[]>([]); // Hold filtered admins based on selected program
  const [email, setEmail] = useState<string>(""); // For email input (Admin's email)
  const [programs, setPrograms] = useState<Program[]>([]); // To hold the programs fetched from API
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
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false); // State for edit modal visibility
  const [programToEdit, setProgramToEdit] = useState<Program | null>(null); // Program to be edited
  const [editProgramEn, setEditProgramEn] = useState<string>(""); // State for edit program name (English)
  const [editProgramTh, setEditProgramTh] = useState<string>(""); // State for edit program name (Thai)
  const [editAbbreviation, setEditAbbreviation] = useState<string>(""); // State for edit program abbreviation

  // Fetching admin data from the API using the controller
  
  const loadAdmins = useCallback( async () => {
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
  }, [programs]); // Depend on programs to ensure they are loaded before mapping
  useEffect(() => {
    loadAdmins();
  }, [programs ]); // Depend on programs to ensure they are loaded before mapping

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
    if (!email || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      setEmailError("Enter a valid CMU account");
      return;
    }
    setEmailError(null);
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

  // Handle program edit
  const handleEditProgram = async () => {
    if (programToEdit && editProgramEn && editProgramTh) {
      try {
        const updatedProgram = await putEditProgram({
          id: programToEdit.id,
          program_name_en: editProgramEn,
          program_name_th: editProgramTh,
          abbreviation: editAbbreviation,
        });

        const updatedPrograms = programs.map((program) =>
          program.id === updatedProgram.id ? updatedProgram : program
        );
        setPrograms(updatedPrograms);

        setEditProgramEn(""); // Clear input after editing
        setEditProgramTh(""); // Clear input after editing
        setEditAbbreviation(""); // Clear input after editing
        setIsEditModalOpen(false); // Close the modal
        fetchPrograms(); // Call fetchPrograms after editing a program
      } catch (error) {
        console.error("Error editing program:", error);
      }
    } else {
      alert("Please provide both English and Thai program names.");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      {/* Admin Program Manager Section */}
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-medium text-gray-900">
              Admin Program Manager
            </h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Add Admin
            </button>
          </div>

          {/* Search and Filter Section */}
          <div className="mb-6 flex gap-4">
            <input
              type="text"
              placeholder="Search by CMU Account or Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Select
              value={selectedProgram}
              onChange={handleFilterProgramChange}
              options={[
                { value: 0, label: "Select Program" },
                { value: -1, label: "All Programs" },
                ...programs.map((program) => ({
                  value: program.id,
                  label: program.program_name_en,
                })),
              ]}
              className="w-64"
              classNamePrefix="select"
              placeholder="Filter by Program"
              styles={{
                control: (base) => ({
                  ...base,
                  borderColor: '#e5e7eb',
                  '&:hover': {
                    borderColor: '#e5e7eb'
                  }
                }),
                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#eff6ff' : 'white',
                  color: state.isSelected ? 'white' : '#374151'
                })
              }}
            />
          </div>

          {/* Admin Table */}
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 font-medium">
                <tr>
                  <th scope="col" className="px-4 py-3">CMU Account</th>
                  <th scope="col" className="px-4 py-3">Name</th>
                  <th scope="col" className="px-4 py-3">Program</th>
                  <th scope="col" className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAdmins.map((item, index) => (
                  <tr 
                    key={item.email} 
                    className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                  >
                    <td className="px-4 py-3 text-gray-900">{item.email}</td>
                    <td className="px-4 py-3">
                      <div className="text-gray-900">{item.nameEn}</div>
                      <div className="text-gray-500 text-xs">{item.nameTh}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {item.programIds.map((programId) => {
                          const colorTheme = getColorForProgram(programId);
                          return (
                            <span
                              key={programId}
                              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colorTheme.bg} ${colorTheme.text}`}
                            >
                              {getProgramAbbreviationById(programId, programs)}
                            </span>
                          );
                        })}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => { setAdminToDelete(item); setIsDeleteModalOpen(true); }}
                        className="text-sm font-medium text-red-600 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Program Names Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-medium text-gray-900">Program Names</h1>
            <button
              onClick={() => setIsProgramModalOpen(true)}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Add Program
            </button>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 font-medium">
                <tr>
                  <th scope="col" className="px-4 py-3 w-16">No.</th>
                  <th scope="col" className="px-4 py-3">Program Name En</th>
                  <th scope="col" className="px-4 py-3">Program Name Th</th>
                  <th scope="col" className="px-4 py-3">Abbreviation</th>
                  <th scope="col" className="px-4 py-3 w-20">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {programs.map((program, index) => {
                  const colorTheme = getColorForProgram(program.id);
                  return (
                    <tr key={program.id} className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <td className="px-4 py-3 text-gray-900">{index + 1}</td>
                      <td className="px-4 py-3 text-gray-900">{program.program_name_en}</td>
                      <td className="px-4 py-3 text-gray-900">{program.program_name_th}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colorTheme.bg} ${colorTheme.text}`}>
                          {program.abbreviation}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => {
                            setProgramToEdit(program);
                            setEditProgramEn(program.program_name_en);
                            setEditProgramTh(program.program_name_th);
                            setEditAbbreviation(program.abbreviation);
                            setIsEditModalOpen(true);
                          }}
                          className="text-sm font-medium text-blue-600 hover:text-blue-700"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Admin Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity"></div>
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add Admin to Program</h3>
            <div className="space-y-4">
              <div>
                <input
                  type="email"
                  placeholder="User Account"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {emailError && <p className="mt-1 text-sm text-red-600">{emailError}</p>}
              </div>
              <Select
                isMulti
                value={selectedPrograms}
                onChange={(newSelectedPrograms: MultiValue<ProgramOption>) =>
                  setSelectedPrograms(newSelectedPrograms)
                }
                options={programs.map((program) => ({
                  value: program.id,
                  label: program.program_name_en,
                }))}
                className="w-full"
                classNamePrefix="select"
                styles={{
                  control: (base) => ({
                    ...base,
                    borderColor: '#e5e7eb',
                    '&:hover': {
                      borderColor: '#e5e7eb'
                    }
                  }),
                  option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#eff6ff' : 'white',
                    color: state.isSelected ? 'white' : '#374151'
                  })
                }}
              />
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddAdmin}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Admin Modal */}
      {isDeleteModalOpen && adminToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity"></div>
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="text-center">
              <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Admin</h3>
              <p className="text-sm text-gray-500 mb-4">Are you sure you want to delete this admin?</p>
              <div className="text-sm text-gray-900 mb-2">{adminToDelete.nameEn}</div>
              <div className="text-sm text-gray-500 mb-4">{adminToDelete.email}</div>
              <div className="text-sm text-red-600 mb-2">Programs to be removed:</div>
              <div className="p-2 bg-gray-50 rounded-md mb-6">
                {adminToDelete.programs.split(", ").map((program: string, index: number) => (
                  <div key={index} className="text-sm text-gray-600">{program}</div>
                ))}
              </div>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAdmin}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Program Modal */}
      {isProgramModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity"></div>
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add Program</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Program Name (En)"
                value={newProgramEn}
                onChange={(e) => setNewProgramEn(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Program Name (Th)"
                value={newProgramTh}
                onChange={(e) => setNewProgramTh(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Abbreviation (e.g. CPE)"
                value={newAbbreviation}
                onChange={(e) => setNewAbbreviation(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setIsProgramModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddProgram}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Program Modal */}
      {isEditModalOpen && programToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity"></div>
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Program</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Program Name (En)</label>
                <input
                  type="text"
                  value={editProgramEn}
                  onChange={(e) => setEditProgramEn(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Program Name (Th)</label>
                <input
                  type="text"
                  value={editProgramTh}
                  onChange={(e) => setEditProgramTh(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Abbreviation</label>
                <input
                  type="text"
                  value={editAbbreviation}
                  onChange={(e) => setEditAbbreviation(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditProgram}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
