"use client";
import React, { useEffect, useState } from "react";
import { Advisor } from "@/models/Advisor";
import Spinner from "@/components/Spinner";
import postCreateEmployee, { uploadStaffFromExcel } from "@/utils/configemployee/postCreateEmployee";
import getEmployeeByProgramId from "@/utils/advisorstats/getEmployeebyProgramId";
import putUpdateEmployee from "@/utils/configemployee/putEditEmployee";
import { useAuth } from "@/hooks/useAuth";
import { AllProgram } from "@/models/AllPrograms";
import { getProgramOptions } from "@/utils/programHelpers";
import ExcelTemplateSection from "@/components/ExcelTemplateSection";

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

  // Major selector states
  const [selectedMajor, setSelectedMajor] = useState<number>(0);
  const [options, setOptions] = useState<AllProgram[]>([]);

  // File upload states
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
  const fetchAdvisors = async () => {
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
  };
  
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
    } else {
      setPrefixEn("");
      setPrefixTh("");
      setFirstNameEn("");
      setFirstNameTh("");
      setLastNameEn("");
      setLastNameTh("");
      setEmail("");
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
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow p-6">
        {/* Container for Program selector */}
        <div className="mb-5 p-4 rounded-md shadow-sm border border-gray-200 bg-white">
          <label
            htmlFor="majorSelect"
            className="block mb-2 text-sm font-semibold text-gray-700"
          >
            Program:
          </label>
          <select
            id="majorSelect"
            value={selectedMajor}
            onChange={(e) => setSelectedMajor(Number(e.target.value))}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded
             focus:outline-none focus:ring-2 focus:ring-red-900"
          >
            {options.map((option) => (
              <option key={option.id} value={option.id}>
                {option.program_name_en}
              </option>
            ))  
            }
          </select>
        <div className="my-8 border border-gray-300 rounded-lg p-4 ">
          <ExcelTemplateSection title="Roster_Staff_Template" templateUrl="/UploadExample/staff_form.xlsx" />
        </div>
        </div>
        {/* Hide content if no program is selected */}
        {selectedMajor !== 0 && (
          <>
            {/* Header + Add Staff Button */}
            <div className="flex items-center justify-between mb-3">
              <h1 className="text-lg font-semibold text-gray-800">
                Config Advisor
              </h1>
              <div className="flex gap-2">

              <button
                onClick={() => handleOpenModal()}
                className="px-4 py-2 bg-primary_button text-white font-medium rounded 
                           hover:bg-button_hover focus:outline-none focus:ring-2 focus:ring-button_focus"
              >
                Add Staff
              </button>
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="px-4 py-2 bg-green-600 text-white font-medium rounded 
                           hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-button_focus"
              >
                Add Staff From Excel
              </button>
              </div>
            </div>

            {/* Modal for Add/Edit Advisor */}
            {isModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-sm">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    {isEditMode ? "Edit Advisor" : "Add New Advisor"}
                  </h2>

                  {/* English Section */}
                  <div className="mb-4 p-3 border border-gray-200 rounded">
                    <h3 className="text-md font-semibold text-gray-700 mb-2">
                      English
                    </h3>
                    <div className="mb-2">
                      <label
                        htmlFor="prefixEn"
                        className="text-sm text-gray-700 block mb-1"
                      >
                        Position (EN)
                      </label>
                      <input
                        id="prefixEn"
                        type="text"
                        value={prefixEn}
                        onChange={(e) => setPrefixEn(e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm
                                   focus:outline-none focus:ring-2 focus:ring-red-900
                                   focus:border-transparent"
                      />
                    </div>
                    <div className="mb-2">
                      <label
                        htmlFor="firstNameEn"
                        className="text-sm text-gray-700 block mb-1"
                      >
                        First Name (EN)
                      </label>
                      <input
                        id="firstNameEn"
                        type="text"
                        value={firstNameEn}
                        onChange={(e) => setFirstNameEn(e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm
                                   focus:outline-none focus:ring-2 focus:ring-button_primary
                                   focus:border-transparent"
                      />
                    </div>
                    <div className="mb-2">
                      <label
                        htmlFor="lastNameEn"
                        className="text-sm text-gray-700 block mb-1"
                      >
                        Last Name (EN)
                      </label>
                      <input
                        id="lastNameEn"
                        type="text"
                        value={lastNameEn}
                        onChange={(e) => setLastNameEn(e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm
                                   focus:outline-none focus:ring-2 focus:ring-button_focus
                                   focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Thai Section */}
                  <div className="mb-4 p-3 border border-gray-200 rounded">
                    <h3 className="text-md font-semibold text-gray-700 mb-2">
                      Thai
                    </h3>
                    <div className="mb-2">
                      <label
                        htmlFor="prefixTh"
                        className="text-sm text-gray-700 block mb-1"
                      >
                        ตำแหน่ง (TH)
                      </label>
                      <input
                        id="prefixTh"
                        type="text"
                        value={prefixTh}
                        onChange={(e) => setPrefixTh(e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm
                                   focus:outline-none focus:ring-2 focus:ring-red-900
                                   focus:border-transparent"
                      />
                    </div>
                    <div className="mb-2">
                      <label
                        htmlFor="firstNameTh"
                        className="text-sm text-gray-700 block mb-1"
                      >
                        ชื่อจริง (TH)
                      </label>
                      <input
                        id="firstNameTh"
                        type="text"
                        value={firstNameTh}
                        onChange={(e) => setFirstNameTh(e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm
                                   focus:outline-none focus:ring-2 focus:ring-button_primary
                                   focus:border-transparent"
                      />
                    </div>
                    <div className="mb-2">
                      <label
                        htmlFor="lastNameTh"
                        className="text-sm text-gray-700 block mb-1"
                      >
                        นามสกุล (TH)
                      </label>
                      <input
                        id="lastNameTh"
                        type="text"
                        value={lastNameTh}
                        onChange={(e) => setLastNameTh(e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm
                                   focus:outline-none focus:ring-2 focus:ring-button_focus
                                   focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Email Section */}
                  <div className="mb-3">
                    <label
                      htmlFor="email"
                      className="text-sm text-gray-700 block mb-1"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm
                                 focus:outline-none focus:ring-2 focus:ring-button_focus
                                 focus:border-transparent"
                    />
                    {emailError && <p className="text-red-600 text-sm mt-1">{emailError}</p>}
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="px-3 py-1 bg-gray-300 text-gray-700 rounded
                                 hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveAdvisor}
                      className="px-3 py-1 bg-primary_button text-white rounded hover:bg-button_hover"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Modal for Uploading Staff File */}
            {isUploadModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-sm">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Upload Staff File
                  </h2>
                  <label
                    htmlFor="dropzone-file"
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg
                        className="w-8 h-8 mb-4 text-gray-500"
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
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
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
                    <p className="mt-2 text-sm text-gray-500">Selected file: {selectedFile.name}</p>
                  )}
                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      onClick={() => setIsUploadModalOpen(false)}
                      className="px-3 py-1 bg-gray-300 text-gray-700 rounded
                                 hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpLoadStaffFile}
                      className="px-3 py-1 bg-primary_button text-white rounded hover:bg-button_hover"
                    >
                      Upload
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Table of Advisors */}
            {loading ? (
              <Spinner />
            ) : (
              <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-6">
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        ID
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Email
                      </th>
                      <th scope="col" className="px-3 py-3 text-center w-24">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {advisors && advisors.length > 0 ? (
                      advisors.map((item , index) => (
                        <tr
                          key={item.id}
                          className="bg-white border-b hover:bg-gray-50"
                        >
                          <td className="px-6 py-4 font-medium text-gray-900">
                            {index + 1} 
                          </td>
                          <td className="px-6 py-4 font-medium text-gray-900">
                            {item.prefix_en} {item.first_name_en}{" "}
                            {item.last_name_en}
                          </td>
                          <td className="px-6 py-4">{item.email}</td>
                          <td className="px-3 py-4 text-center">
                            <button
                              onClick={() => handleOpenModal(item)}
                              className="text-blue-600 hover:underline"
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-6 py-4 text-center text-gray-500"
                        >
                          No Data
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
