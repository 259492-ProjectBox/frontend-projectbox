"use client";
import React, { useEffect, useState } from "react";
import Spinner from "@/components/Spinner";
import { ConfigProgramSetting } from "@/models/ConfigProgram";
import { getConfigProgram } from "@/utils/configprogram/configProgram";
import { AllProgram } from "@/models/AllPrograms";
import { getProgramOptions } from "@/utils/programHelpers";
import { useAuth } from "@/hooks/useAuth";
import { updateConfigProgram } from "@/utils/configprogram/putConfigProgram";
import { uploadStudentList } from "@/utils/configprogram/uploadstudentlist";
import { uploadCreateProject } from "@/utils/configprogram/uploadcreateproject";
import ExcelTemplateSection from "@/components/ExcelTemplateSection";
import axios from "axios";

// Function to convert string to title case
const toTitleCase = (str: string) => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

export default function ConfigProgram() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Local states for semester & academic year
  const [semester, setSemester] = useState<string>("");
  const [academicYear, setAcademicYear] = useState<string>("");

  // Program data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // File Upload state
  const [file, setFile] = useState<File | null>(null);

  const { user } = useAuth();
  const [selectedMajor, setSelectedMajor] = useState<number>(0);
  const [options, setOptions] = useState<AllProgram[]>([]);

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

  // Fetch configuration data for selected program
  const [configData, setConfigData] = useState<ConfigProgramSetting[]>([]);
  useEffect(() => {
    if (selectedMajor === 0) return; // Skip if no program is selected

    const loadData = async () => {
      setLoading(true);
      try {
        const data = await getConfigProgram(selectedMajor);
        console.log("Data Config:", data);

        if (!Array.isArray(data)) {
          throw new Error("Unexpected response format");
        }
        setConfigData(data);

        // Set semester and academic year from fetched data
        const semesterConfig = data.find(
          (item) => item.config_name === "semester"
        );
        const academicYearConfig = data.find(
          (item) => item.config_name === "academic year"
        );
        if (semesterConfig) setSemester(semesterConfig.value);
        if (academicYearConfig) setAcademicYear(academicYearConfig.value);
      } catch (err) {
        console.error("Error fetching config:", err);
        setError("Failed to load configurations.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedMajor]);

  // Handler for saving changes in edit mode
  const handleSave = async () => {
    try {
      const academicYearConfig = configData.find(
        (item) => item.config_name === "academic year"
      );
      const semesterConfig = configData.find(
        (item) => item.config_name === "semester"
      );

      if (academicYearConfig) {
        await updateConfigProgram({
          ...academicYearConfig,
          value: academicYear,
        });
      }

      if (semesterConfig) {
        await updateConfigProgram({
          ...semesterConfig,
          value: semester,
        });
      }

      // console.log("Saved values - Academic Year:", academicYear, "Semester:", semester);
      alert("Update successful!");
      setIsEditMode(false); // Turn off edit mode
    } catch (error) {
      console.error("Error saving config:", error);
      setError("Failed to save configurations.");
      alert("Update failed!");
    }
  };

  // Handler for file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFile = e.target.files[0];
      const allowedTypes = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
      ];

      if (!allowedTypes.includes(selectedFile.type)) {
        alert("Please upload an Excel file.");
        return;
      }

      setFile(selectedFile);
    }
  };

  // Handler for saving the uploaded file
  const handleSaveUpload = async () => {
    if (file) {
      try {
        const response = await uploadStudentList(file, selectedMajor);
        console.log("File uploaded successfully:", response);
        alert("File uploaded successfully!");
        setFile(null); // Clear the file input
      } catch (error) {
        console.error("Error uploading file:", error);
        alert("Failed to upload file.");
      }
    } else {
      console.log("No file selected for upload.");
      alert("No file selected for upload.");
    }
  };

  // Handler for saving the uploaded project creation file
  const handleSaveProjectUpload = async () => {
    if (file) {
      try {
        const response = await uploadCreateProject(file, selectedMajor);
        console.log("File uploaded successfully:", response);
        alert("File uploaded successfully!");
        setFile(null); // Clear the file input
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          console.error("Error uploading file:", error.response.data);
          alert("Failed to upload file: " + error.response.data.error);
        } else {
          console.error("Error uploading file:", error);
          alert("Failed to upload file.");
        }
      }
    } else {
      console.log("No file selected for upload.");
      alert("No file selected for upload.");
    }
  };

  // Accordion state
  const [isAccordionOpen1, setIsAccordionOpen1] = useState(true);
  const [isAccordionOpen2, setIsAccordionOpen2] = useState(false);

  // Show loading or error
  if (loading) return <Spinner />;
  if (error) {
    return (
      <div className="min-h-screen p-4 bg-gray-100 flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-6xl mx-auto rounded-lg p-4">
        {/* Program Selector */}
        <div className="mb-5 p-4 rounded-md  bg-white">
          <label
            htmlFor="programSelect"
            className="block mb-2 text-sm font-semibold text-gray-700"
          >
            Program:
          </label>
          <select
            id="programSelect"
            value={selectedMajor}
            onChange={(e) => setSelectedMajor(Number(e.target.value))}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded
                       focus:outline-none focus:ring-2 focus:ring-red-900"
          >
            {options.map((option) => (
              <option key={option.id} value={option.id}>
                {option.program_name_en}
              </option>
            ))}
          </select>
        </div>

        {/* Hide content if no program is selected */}
        {selectedMajor !== 0 && (
          <div>
            {/* Config Data Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              {configData.length > 0 ? (
                configData.map((item: ConfigProgramSetting, index) => (
                  <div
                    key={index}
                    className="bg-white p-4 rounded-lg shadow-md"
                  >
                    <h2 className="text-gray-800 font-semibold">
                      {toTitleCase(item.config_name)}
                    </h2>

                    {/* Toggling read-only vs. edit mode for specific items */}
                    {item.config_name === "semester" ? (
                      isEditMode ? (
                        <select
                          value={semester}
                          onChange={(e) => setSemester(e.target.value)}
                          className="mt-2 p-2 border border-gray-300 rounded"
                        >
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3 (Summer)</option>
                        </select>
                      ) : (
                        <p className="text-gray-600 mt-2">{semester}</p>
                      )
                    ) : item.config_name === "academic year" ? (
                      isEditMode ? (
                        <input
                          type="text"
                          value={academicYear}
                          onChange={(e) => setAcademicYear(e.target.value)}
                          className="mt-2 p-2 border border-gray-300 rounded"
                        />
                      ) : (
                        <p className="text-gray-600 mt-2">{academicYear}</p>
                      )
                    ) : (
                      <p className="text-gray-600 mt-2">{item.value}</p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-600">
                  No configuration data found for this program.
                </p>
              )}
            </div>

            {/* Edit/Save Buttons */}
            <div className="mt-4 flex gap-4">
              <button
                onClick={() => setIsEditMode((prev) => !prev)}
                className="text-white bg-blue-900 py-2 px-4 rounded-lg 
                           hover:bg-blue-800 transition-colors"
              >
                {isEditMode ? "Cancel" : "Edit"}
              </button>
              {isEditMode && (
                <button
                  onClick={handleSave}
                  className="text-white bg-blue-900 py-2 px-4 rounded-lg 
                             hover:bg-blue-800 transition-colors"
                >
                  Save
                </button>
              )}
            </div>

            {/* Space added between the sections */}
            <div className="my-8" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* File Upload Section 1 */}
              <div className="shadow-md bg-white rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Upload Student
                </h3>
                  <ExcelTemplateSection
                    title="Roster_Student_Template"
                    templateUrl="/UploadExample/studentlist_261492-267.xlsx"
                  />
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
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
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
                {file && (
                  <p className="mt-2 text-gray-600">
                    Selected File: {file.name}
                  </p>
                )}

                {/* Save Upload Button */}
                <button
                  onClick={handleSaveUpload}
                  className="mt-4 text-white bg-blue-900 py-2 px-4 rounded-lg 
                 hover:bg-blue-800 transition-colors"
                >
                  Save Upload
                </button>
              </div>

              {/* File Upload Section 2 */}
              <div className="shadow-md bg-white rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Upload Project
                </h3>
                  <ExcelTemplateSection
                    title="Roster_Project_Template"
                    templateUrl="/UploadExample/projectcreate.xlsx"
                  />
                <label
                  htmlFor="dropzone-file-existing"
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
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      .xlsx file only (MAX. 800 KB)
                    </p>
                  </div>
                  <input
                    id="dropzone-file-existing"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
                {file && (
                  <p className="mt-2 text-gray-600">
                    Selected File: {file.name}
                  </p>
                )}

                {/* Save Upload Button */}
                <button
                  onClick={handleSaveProjectUpload}
                  className="mt-4 text-white bg-blue-900 py-2 px-4 rounded-lg 
                 hover:bg-blue-800 transition-colors"
                >
                  Save Upload
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Example Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h2 className="text-lg font-semibold mb-4">Add Asset</h2>
            <div className="flex justify-between mb-4">
              <button
                className="w-1/2 text-center py-2 rounded-lg bg-blue-900 text-white 
                           hover:bg-blue-800 transition-colors"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
