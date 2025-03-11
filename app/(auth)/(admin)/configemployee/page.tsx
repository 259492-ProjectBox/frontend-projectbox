"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Advisor } from "@/models/Advisor";
import Spinner from "@/components/Spinner";
import postCreateEmployee, { uploadStaffFromExcel } from "@/utils/configemployee/postCreateEmployee";
import getEmployeeByProgramId from "@/utils/advisorstats/getEmployeebyProgramId";
import putUpdateEmployee from "@/utils/configemployee/putEditEmployee";
import { useAuth } from "@/hooks/useAuth";
import { AllProgram } from "@/models/AllPrograms";
import { getProgramOptions } from "@/utils/programHelpers";
import ExcelTemplateSection from "@/components/ExcelTemplateSection";
import { isAxiosError } from "axios";
import Pagination from "@/components/Pagination"; // Import Pagination component
import Avatar from "@/components/Avatar"; // Add Avatar import

export default function ConfigAdvisorPage() {
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Modal & form states
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [selectedAdvisor, setSelectedAdvisor] = useState<Advisor | null>(null);

  const [prefixEn, setPrefixEn] = useState<string>("");
  const [prefixTh, setPrefixTh] = useState<string>("");
  const [firstNameEn, setFirstNameEn] = useState<string>("");
  const [firstNameTh, setFirstNameTh] = useState<string>("");
  const [lastNameEn, setLastNameEn] = useState<string>("");
  const [lastNameTh, setLastNameTh] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isActive, setIsActive] = useState<boolean>(true); // State for is_active toggle

  // Major selector states
  const [selectedMajor, setSelectedMajor] = useState<number>(0);
  const [options, setOptions] = useState<AllProgram[]>([]);

  // File upload states
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Confirmation modal states
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [advisorToToggle, setAdvisorToToggle] = useState<Advisor | null>(null);

  const [currentPage, setCurrentPage] = useState<number>(1); // Current page state
  const itemsPerPage = 10; // Items per page
  const [filter, setFilter] = useState<string>(""); // State for filter input

  useEffect(() => {
    const fetchOptions = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const programOptions = await getProgramOptions(user.isAdmin);
        setOptions(programOptions);

        // Ensure selectedMajor is in options; otherwise, reset to default (0)
        if (!programOptions.some((option) => option.id === selectedMajor)) {
          setSelectedMajor(0);
        }
      } catch (err) {
        console.error("Error fetching program options:", err);
        setError("Failed to load program options.");
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, [user, selectedMajor]); // Re-fetch when `user` or `selectedMajor` changes

  // Fetch advisors by selected major ID
  const fetchAdvisors = useCallback( async () => {
    setLoading(true);
    try {
      const data: Advisor[] = await getEmployeeByProgramId(selectedMajor);
      setAdvisors(data);
    } catch (err) {
      console.error("Error fetching advisors:", err);
      setError("Failed to load advisors.");
    } finally {
      setLoading(false);
    }
  }, [selectedMajor]);
  
  useEffect(() => {
    fetchAdvisors();
  }, [selectedMajor, user]);

  // Handler for opening the modal (edit or add mode)
  const handleOpenModal = (advisor: Advisor | null = null) => {
    setIsEditMode(!!advisor);
    setSelectedAdvisor(advisor);

    if (advisor) {
      setPrefixEn(advisor.prefix_en);
      setPrefixTh(advisor.prefix_th);
      setFirstNameEn(advisor.first_name_en);
      setFirstNameTh(advisor.first_name_th);
      setLastNameEn(advisor.last_name_en);
      setLastNameTh(advisor.last_name_th);
      setEmail(advisor.email);
      setIsActive(!advisor.is_resigned); // Set isActive based on is_resigned
    } else {
      setPrefixEn("");
      setPrefixTh("");
      setFirstNameEn("");
      setFirstNameTh("");
      setLastNameEn("");
      setLastNameTh("");
      setEmail("");
      setIsActive(true); // Default to active
    }

    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpLoadStaffFile = async () => {
    if (selectedFile) {
      try {
        const message = await uploadStaffFromExcel(selectedMajor, selectedFile);
        alert(message);
        setSelectedFile(null);
        fetchAdvisors();
      } catch (error) {
        if(isAxiosError(error)) {
          alert(error.response?.data.message || "Failed to upload staff from Excel. Please try again.");
        } else
        
        alert("Failed to upload staff from Excel. Please try again.");
      }
    }
    setIsUploadModalOpen(false);
  };

  // Save (create or update) advisor
  const handleSaveAdvisor = async () => {
    if (!email || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      setEmailError("Enter a valid CMU account");
      return;
    }
    setEmailError(null);
    try {
      if (isEditMode && selectedAdvisor) {
        // Update existing advisor
        const updatedAdvisor = {
          ...selectedAdvisor,
          prefix_en: prefixEn,
          prefix_th: prefixTh,
          first_name_en: firstNameEn,
          first_name_th: firstNameTh,
          last_name_en: lastNameEn,
          last_name_th: lastNameTh,
          email,
          is_resigned: !isActive, // Update is_resigned based on isActive
        };
        const updatedEmployee = await putUpdateEmployee(updatedAdvisor);
        setAdvisors((prev) =>
          prev.map((advisor) =>
            advisor.id === selectedAdvisor.id ? updatedEmployee : advisor
          )
        );
        alert("Advisor updated successfully!");
      } else {
        // Create new advisor
        const newAdvisorPayload = {
          prefix_en: prefixEn,
          prefix_th: prefixTh,
          first_name_en: firstNameEn,
          first_name_th: firstNameTh,
          last_name_en: lastNameEn,
          last_name_th: lastNameTh,
          email,
          program_id: selectedMajor,
          is_resigned: !isActive, // Set is_resigned based on isActive
        };
        const newAdvisor = await postCreateEmployee(newAdvisorPayload);
        setAdvisors((prev) => [...prev, newAdvisor]);
        alert("Advisor created successfully!");
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error saving advisor:", err);
      alert("Failed to save advisor.");
    }
  };

  // Handler for confirming toggle action
  const handleConfirmToggle = async () => {
    if (advisorToToggle) {
      // console.log("Resigned 1", advisorToToggle);

      const updatedAdvisor = {
        ...advisorToToggle,
        is_resigned: true,
      };
      // console.log("Resigned 2", updatedAdvisor);

      try {
        const updatedEmployee = await putUpdateEmployee(updatedAdvisor);
        // console.log("Updated employee response:", updatedEmployee);
        setAdvisors((prev) =>
          prev.map((advisor) =>
            advisor.id === advisorToToggle.id ? updatedEmployee : advisor
          )
        );
        setIsConfirmModalOpen(false);
        setAdvisorToToggle(null);
      } catch (error) {
        console.error("Error updating advisor:", error);
        alert("Failed to update advisor.");
      }
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page); // Set current page
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top
  };

  // Filter advisors based on filter input
  const filteredAdvisors = (advisors || []).filter((advisor) =>
    `${advisor.prefix_en} ${advisor.first_name_en} ${advisor.last_name_en} ${advisor.email}`
      .toLowerCase()
      .includes(filter.toLowerCase())
  );

  // Calculate the current page's advisors
  const currentAdvisors = filteredAdvisors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Display loading or error states
  if (loading) return <Spinner />;
  if (error) {
    return (
      <div className="min-h-screen p-4 bg-gray-100 flex items-center justify-center">
        <p className="text-primary_text">{error}</p>
      </div>
    );
  }

  // Main layout
  return (
    <div className="min-h-screen bg-gray-50/50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Program Selector */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="p-5">
            <label htmlFor="majorSelect" className="block text-sm font-medium text-gray-700">
              Select Program
            </label>
            <select
              id="majorSelect"
              value={selectedMajor}
              onChange={(e) => setSelectedMajor(Number(e.target.value))}
              className="mt-1.5 w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg
                       focus:ring-2 focus:ring-primary-light focus:border-primary-light transition-colors"
            >
              {options.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.program_name_en}
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedMajor !== 0 && (
          <>
            <div className="p-4 mb-6 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <ExcelTemplateSection title="Roster_Staff_Template" templateUrl="/UploadExample/staff_form.xlsx" />
            </div>

            {/* Header + Add Staff Button */}
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-lg font-medium text-gray-800">
                Manage Staff
              </h1>
              <div className="flex gap-3">
                <button
                  onClick={() => handleOpenModal()}
                  className="px-4 py-2 bg-primary_button text-white text-sm font-medium rounded-lg
                           hover:bg-button_hover transition-colors duration-200"
                >
                  Add Staff
                </button>
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg
                           hover:bg-green-700 transition-colors duration-200"
                >
                  Import Excel
                </button>
              </div>
            </div>

            <input
              type="text"
              placeholder="Filter by name or email"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="mb-4 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-light focus:border-primary-light transition-colors"
            />

            {/* Table of Advisors */}
            {loading ? (
              <Spinner />
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3  text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                        Actions
                      </th>
                      <th className="px-6 py-3  text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {currentAdvisors && currentAdvisors.length > 0 ? (
                      currentAdvisors.map((item, index) => (
                        <tr
                          key={item.id}
                          className="hover:bg-gray-50/50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {index + 1 + (currentPage - 1) * itemsPerPage}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Avatar
                                name={`${item.first_name_en} ${item.last_name_en}`}
                                size="sm"
                              />
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">
                                  {item.prefix_en} {item.first_name_en} {item.last_name_en}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {item.prefix_th} {item.first_name_th} {item.last_name_th}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {item.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <button
                              onClick={() => handleOpenModal(item)}
                              className="text-sm font-medium text-primary-DEFAULT hover:text-primary-dark transition-colors"
                            >
                              Edit
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={!item.is_resigned}
                                onChange={() => {
                                  if (!item.is_resigned) {
                                    setAdvisorToToggle(item);
                                    setIsConfirmModalOpen(true);
                                  } else {
                                    const updatedAdvisor = {
                                      ...item,
                                      is_resigned: !item.is_resigned,
                                    };
                                    putUpdateEmployee(updatedAdvisor).then(() => {
                                      setAdvisors((prev) =>
                                        prev.map((advisor) =>
                                          advisor.id === item.id ? updatedAdvisor : advisor
                                        )
                                      );
                                    });
                                  }
                                }}
                              />
                              <div className="w-9 h-5 bg-gray-200 rounded-full peer 
                                          peer-checked:bg-primary-light peer-focus:ring-2 
                                          peer-focus:ring-primary-light/30 
                                          after:content-[''] after:absolute after:top-[2px] 
                                          after:left-[2px] after:bg-white after:rounded-full 
                                          after:h-4 after:w-4 after:transition-all
                                          peer-checked:after:translate-x-full">
                              </div>
                            </label>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-4 text-center text-gray-500"
                        >
                          No Data Available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                <div className="px-6 py-3 border-t border-gray-100">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={advisors ? Math.ceil(advisors.length / itemsPerPage) : 0}
                    onPageChange={handlePageChange}
                  />
                </div>
              </div>
            )}

            {/* Modal for Add/Edit Advisor */}
            {isModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
                  <h2 className="text-lg font-medium text-gray-800 mb-4">
                    {isEditMode ? "Edit Staff" : "Add New Staff"}
                  </h2>

                  {/* English Section */}
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Position (EN)
                      </label>
                      <input
                        type="text"
                        value={prefixEn}
                        onChange={(e) => setPrefixEn(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm
                                 focus:outline-none focus:ring-1 focus:ring-primary_button"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name (EN)
                      </label>
                      <input
                        type="text"
                        value={firstNameEn}
                        onChange={(e) => setFirstNameEn(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm
                                 focus:outline-none focus:ring-1 focus:ring-primary_button"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name (EN)
                      </label>
                      <input
                        type="text"
                        value={lastNameEn}
                        onChange={(e) => setLastNameEn(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm
                                 focus:outline-none focus:ring-1 focus:ring-primary_button"
                      />
                    </div>
                  </div>

                  {/* Thai Section */}
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ตำแหน่ง (TH)
                      </label>
                      <input
                        type="text"
                        value={prefixTh}
                        onChange={(e) => setPrefixTh(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm
                                 focus:outline-none focus:ring-1 focus:ring-primary_button"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ชื่อจริง (TH)
                      </label>
                      <input
                        type="text"
                        value={firstNameTh}
                        onChange={(e) => setFirstNameTh(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm
                                 focus:outline-none focus:ring-1 focus:ring-primary_button"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        นามสกุล (TH)
                      </label>
                      <input
                        type="text"
                        value={lastNameTh}
                        onChange={(e) => setLastNameTh(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm
                                 focus:outline-none focus:ring-1 focus:ring-primary_button"
                      />
                    </div>
                  </div>

                  {/* Email Section */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm
                               focus:outline-none focus:ring-1 focus:ring-primary_button"
                    />
                    {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
                  </div>

                  {/* Is Active Toggle */}
                  <div className="mb-6">
                    <label className="inline-flex items-center">
                      <span className="mr-3 text-sm font-medium text-gray-700">Active Status</span>
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={isActive}
                        onChange={() => setIsActive(!isActive)}
                      />
                      <div className="relative w-9 h-5 bg-gray-200 rounded-full peer 
                                          peer-checked:bg-primary-light peer-focus:ring-2 
                                          peer-focus:ring-primary-light/30 
                                          after:content-[''] after:absolute after:top-[2px] 
                                          after:left-[2px] after:bg-white after:rounded-full 
                                          after:h-4 after:w-4 after:transition-all
                                          peer-checked:after:translate-x-full"></div>
                    </label>
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 
                               rounded-md hover:bg-gray-200 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveAdvisor}
                      className="px-4 py-2 text-sm font-medium text-white bg-primary_button 
                               rounded-md hover:bg-button_hover transition-colors duration-200"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Modal for Uploading Staff File */}
            {isUploadModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
                  <h2 className="text-lg font-medium text-gray-800 mb-4">
                    Upload Staff File
                  </h2>
                  <label
                    htmlFor="dropzone-file"
                    className="flex flex-col items-center justify-center w-full h-48 border-2 
                             border-gray-200 border-dashed rounded-lg cursor-pointer bg-gray-50 
                             hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg
                        className="w-8 h-8 mb-3 text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 16"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                        />
                      </svg>
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-medium">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-400">
                        .xlsx file only (MAX. 800 KB)
                      </p>
                    </div>
                    <input
                      id="dropzone-file"
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                  {selectedFile && (
                    <p className="mt-2 text-sm text-gray-500">Selected: {selectedFile.name}</p>
                  )}
                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      onClick={() => setIsUploadModalOpen(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 
                               rounded-md hover:bg-gray-200 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpLoadStaffFile}
                      className="px-4 py-2 text-sm font-medium text-white bg-primary_button 
                               rounded-md hover:bg-button_hover transition-colors duration-200"
                    >
                      Upload
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Confirmation Modal */}
            {isConfirmModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm mx-4">
                  <h2 className="text-lg font-medium text-gray-800 mb-4">
                    Confirm Action
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Are you sure you want to set this staff member to inactive?
                  </p>
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setIsConfirmModalOpen(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 
                               rounded-md hover:bg-gray-200 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmToggle}
                      className="px-4 py-2 text-sm font-medium text-white bg-red-600 
                               rounded-md hover:bg-red-700 transition-colors duration-200"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
