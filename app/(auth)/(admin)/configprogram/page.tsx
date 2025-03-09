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
import { getAcademicYears } from "@/utils/configprogram/getAcademicYears";
import { getStudentsByProgram } from "@/utils/configprogram/getStudentsListByProgram";
import { AcademicYear } from "@/models/AcademicYear";
import { Student } from "@/models/Student";
import Pagination from "@/components/Pagination";

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

  // File Upload states - separate for student and project
  const [studentFile, setStudentFile] = useState<File | null>(null);
  const [projectFile, setProjectFile] = useState<File | null>(null);

  const { user } = useAuth();
  const [selectedMajor, setSelectedMajor] = useState<number>(0);
  const [options, setOptions] = useState<AllProgram[]>([]);

  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [selectedSearchAcademicYear, setSelectedSearchAcademicYear] = useState<string>("");
  const [selectedSearchSemester, setSelectedSearchSemester] = useState<string>("1");
  const [studentListData, setStudentListData] = useState<Student[]>([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Add pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10; // Number of items to show per page

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

  useEffect(() => {
    const fetchAcademicYears = async () => {
      try {
        const years = await getAcademicYears();
        setAcademicYears(years);
      } catch (error) {
        console.error("Error fetching academic years:", error);
      }
    };

    fetchAcademicYears();
  }, []);

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

  // Handler for student file upload
  const handleStudentFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

      setStudentFile(selectedFile);
    }
  };

  // Handler for project file upload
  const handleProjectFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

      setProjectFile(selectedFile);
    }
  };

  // Handler for saving the uploaded student file
  const handleSaveStudentUpload = async () => {
    if (studentFile) {
      try {
        const response = await uploadStudentList(studentFile, selectedMajor);
        console.log("Student file uploaded successfully:", response);
        alert("Student file uploaded successfully!");
        setStudentFile(null); // Clear the file input
      } catch (error) {
        console.error("Error uploading student file:", error);
        alert("Failed to upload student file.");
      }
    } else {
      console.log("No student file selected for upload.");
      alert("No student file selected for upload.");
    }
  };

  // Handler for saving the uploaded project file
  const handleSaveProjectUpload = async () => {
    if (projectFile) {
      try {
        const response = await uploadCreateProject(projectFile, selectedMajor);
        console.log("Project file uploaded successfully:", response);
        alert("Project file uploaded successfully!");
        setProjectFile(null); // Clear the file input
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          console.error("Error uploading project file:", error.response.data);
          alert("Failed to upload project file: " + error.response.data.error);
        } else {
          console.error("Error uploading project file:", error);
          alert("Failed to upload project file.");
        }
      }
    } else {
      console.log("No project file selected for upload.");
      alert("No project file selected for upload.");
    }
  };

  const handleFindStudents = async () => {
    if (!selectedMajor || !selectedSearchAcademicYear || !selectedSearchSemester) {
      alert("Please select all required fields");
      return;
    }

    setIsLoadingStudents(true);
    try {
      const students = await getStudentsByProgram(
        selectedMajor,
        parseInt(selectedSearchAcademicYear),
        parseInt(selectedSearchSemester)
      );
      setStudentListData(students);
    } catch (error) {
      console.error("Error fetching students:", error);
      alert("Failed to fetch students");
    } finally {
      setIsLoadingStudents(false);
    }
  };

  // Add this new function to filter students
  const filteredStudents = studentListData.filter((student) => {
    const query = searchQuery.toLowerCase();
    return (
      student.student_id.toLowerCase().includes(query) ||
      student.first_name.toLowerCase().includes(query) ||
      student.last_name.toLowerCase().includes(query) ||
      // student.email.toLowerCase().includes(query) ||
      student.sec_lab.toLowerCase().includes(query)
    );
  });

  // Calculate pagination values
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredStudents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Reset to first page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

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
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-4 flex flex-col h-full">
                <div className="flex-grow">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Upload Student
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">
                    Upload a list of students to grant them permission to create projects for the current academic year and semester. This allows students to submit their own project details.
                  </p>
                  <ExcelTemplateSection
                    title="Roster_Student_Template"
                    templateUrl="/UploadExample/studentlist_261492-267.xlsx"
                  />
                </div>
                <div className="mt-auto">
                  <label
                    htmlFor="student-file-upload"
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
                      id="student-file-upload"
                      type="file"
                      className="hidden"
                      onChange={handleStudentFileChange}
                      accept=".xlsx,.xls"
                    />
                  </label>
                  {studentFile && (
                    <p className="mt-2 text-sm text-gray-500">Selected: {studentFile.name}</p>
                  )}
                  <button
                    onClick={handleSaveStudentUpload}
                    className="mt-3 w-full px-4 py-2 text-sm font-medium text-white bg-primary_button rounded-lg
                             hover:bg-button_hover transition-colors duration-200"
                  >
                    Upload Student List
                  </button>
                </div>
              </div>

              {/* Upload Project Section */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-4 flex flex-col h-full">
                <div className="flex-grow">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Upload Project
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">
                    Upload projects directly as staff. Use this option to create projects on behalf of students or to import existing/old projects into the system.
                  </p>
                  <ExcelTemplateSection
                    title="Roster_Project_Template"
                    templateUrl="/UploadExample/projectcreate.xlsx"
                  />
                </div>
                <div className="mt-auto">
                  <label
                    htmlFor="project-file-upload"
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
                      id="project-file-upload"
                      type="file"
                      className="hidden"
                      onChange={handleProjectFileChange}
                      accept=".xlsx,.xls"
                    />
                  </label>
                  {projectFile && (
                    <p className="mt-2 text-sm text-gray-500">Selected: {projectFile.name}</p>
                  )}
                  <button
                    onClick={handleSaveProjectUpload}
                    className="mt-3 w-full px-4 py-2 text-sm font-medium text-white bg-primary_button rounded-lg
                             hover:bg-button_hover transition-colors duration-200"
                  >
                    Upload Project List
                  </button>
                </div>
              </div>
            </div>

            {/* Student List Section */}
            <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-4">
                Student List
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Academic Year
                  </label>
                  <select
                    value={selectedSearchAcademicYear}
                    onChange={(e) => setSelectedSearchAcademicYear(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg
                             focus:ring-2 focus:ring-primary-light focus:border-primary-light transition-colors"
                  >
                    <option value="">Select Academic Year</option>
                    {academicYears.map((year) => (
                      <option key={year.year_be} value={year.year_be}>
                        {year.year_be}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Semester
                  </label>
                  <select
                    value={selectedSearchSemester}
                    onChange={(e) => setSelectedSearchSemester(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg
                             focus:ring-2 focus:ring-primary-light focus:border-primary-light transition-colors"
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3 (Summer)</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={handleFindStudents}
                    disabled={isLoadingStudents}
                    className="w-full px-4 py-2 text-sm font-medium text-white bg-primary_button rounded-lg
                             hover:bg-button_hover transition-colors duration-200 disabled:opacity-50"
                  >
                    {isLoadingStudents ? "Loading..." : "Find"}
                  </button>
                </div>
              </div>

              {/* Search Input */}
              <div className="mt-4 mb-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by ID, name, or section..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 pl-10 text-sm bg-white border border-gray-200 rounded-lg
                             focus:ring-2 focus:ring-primary-light focus:border-primary-light transition-colors"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Student Table */}
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Section
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentItems.length > 0 ? (
                      currentItems.map((student) => (
                        <tr key={student.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {student.student_id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {student.first_name} {student.last_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {student.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {student.sec_lab}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                          {studentListData.length === 0
                            ? "No students found"
                            : "No matching students found"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                {filteredStudents.length > 0 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
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
