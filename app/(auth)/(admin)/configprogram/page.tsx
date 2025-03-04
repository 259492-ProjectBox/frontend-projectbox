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
    <div className="min-h-screen bg-gray-50/50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Program Selector */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="p-5">
            <label htmlFor="programSelect" className="block text-sm font-medium text-gray-700">
              Select Program
            </label>
            <select
              id="programSelect"
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

        {/* Hide content if no program is selected */}
        {selectedMajor !== 0 && (
          <div className="space-y-4">
            {/* Config Data Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {configData.length > 0 ? (
                configData.map((item: ConfigProgramSetting, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-4">
                    <h2 className="text-sm font-medium text-gray-700">
                      {toTitleCase(item.config_name)}
                    </h2>

                    {item.config_name === "semester" ? (
                      isEditMode ? (
                        <select
                          value={semester}
                          onChange={(e) => setSemester(e.target.value)}
                          className="mt-1.5 w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg
                                   focus:ring-2 focus:ring-primary-light focus:border-primary-light transition-colors"
                        >
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3 (Summer)</option>
                        </select>
                      ) : (
                        <p className="mt-1 text-sm text-gray-600">{semester}</p>
                      )
                    ) : item.config_name === "academic year" ? (
                      isEditMode ? (
                        <input
                          type="text"
                          value={academicYear}
                          onChange={(e) => setAcademicYear(e.target.value)}
                          className="mt-1.5 w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg
                                   focus:ring-2 focus:ring-primary-light focus:border-primary-light transition-colors"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-600">{academicYear}</p>
                      )
                    ) : (
                      <p className="mt-1 text-sm text-gray-600">{item.value}</p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">
                  No configuration data found for this program.
                </p>
              )}
            </div>

            {/* Edit/Save Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setIsEditMode((prev) => !prev)}
                className="px-4 py-2 text-sm font-medium text-white bg-primary_button rounded-lg
                         hover:bg-button_hover transition-colors duration-200"
              >
                {isEditMode ? "Cancel" : "Edit"}
              </button>
              {isEditMode && (
                <button
                  onClick={handleSave}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary_button rounded-lg
                           hover:bg-button_hover transition-colors duration-200"
                >
                  Save
                </button>
              )}
            </div>

            {/* Upload Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Upload Student Section */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Upload Student
                </h3>
                <ExcelTemplateSection
                  title="Roster_Student_Template"
                  templateUrl="/UploadExample/studentlist_261492-267.xlsx"
                />
                <label
                  htmlFor="dropzone-file"
                  className="mt-3 flex flex-col items-center justify-center w-full h-48 border-2 
                           border-gray-200 border-dashed rounded-lg cursor-pointer bg-gray-50 
                           hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="flex flex-col items-center justify-center p-4 text-center">
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
                {file && (
                  <p className="mt-2 text-sm text-gray-500">Selected: {file.name}</p>
                )}
                <button
                  onClick={handleSaveUpload}
                  className="mt-3 w-full px-4 py-2 text-sm font-medium text-white bg-primary_button rounded-lg
                           hover:bg-button_hover transition-colors duration-200"
                >
                  Upload
                </button>
              </div>

              {/* Upload Project Section */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Upload Project
                </h3>
                <ExcelTemplateSection
                  title="Roster_Project_Template"
                  templateUrl="/UploadExample/projectcreate.xlsx"
                />
                <label
                  htmlFor="dropzone-file-existing"
                  className="mt-3 flex flex-col items-center justify-center w-full h-48 border-2 
                           border-gray-200 border-dashed rounded-lg cursor-pointer bg-gray-50 
                           hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="flex flex-col items-center justify-center p-4 text-center">
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
                    id="dropzone-file-existing"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
                {file && (
                  <p className="mt-2 text-sm text-gray-500">Selected: {file.name}</p>
                )}
                <button
                  onClick={handleSaveProjectUpload}
                  className="mt-3 w-full px-4 py-2 text-sm font-medium text-white bg-primary_button rounded-lg
                           hover:bg-button_hover transition-colors duration-200"
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 p-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Add Asset</h2>
            <div className="flex justify-end">
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-primary_button rounded-lg
                         hover:bg-button_hover transition-colors duration-200"
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
