"use client"
import type React from "react"
import { useEffect, useState } from "react"
import NoProgramSelected from "@/components/NoProgramSelected"
import Spinner from "@/components/Spinner"
import type { ConfigProgramSetting } from "@/models/ConfigProgram"
import { getConfigProgram } from "@/app/api/configprogram/configProgram"
import { updateConfigProgram } from "@/app/api/configprogram/putConfigProgram"
import { uploadStudentList } from "@/app/api/configprogram/uploadstudentlist"
import { uploadCreateProject } from "@/app/api/configprogram/uploadcreateproject"
import { getAcademicYears } from "@/app/api/configprogram/getAcademicYears"
import { getStudentsByProgram } from "@/app/api/configprogram/getStudentsListByProgram"
import type { AcademicYear } from "@/models/AcademicYear"
import type { Student } from "@/models/Student"
import { useProgram } from "@/context/ProgramContext"
import ExcelTemplateSection from "@/components/ExcelTemplateSection"
import Pagination from "@/components/Pagination"

// Function to convert string to title case
const toTitleCase = (str: string) => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase())
}

export default function ConfigProgram() {
  const { selectedMajor } = useProgram()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)

  // Local states for semester & academic year
  const [semester, setSemester] = useState<string>("")
  const [academicYear, setAcademicYear] = useState<string>("")

  // Program data
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // File Upload states - separate for student and project
  const [studentFile, setStudentFile] = useState<File | null>(null)
  const [projectFile, setProjectFile] = useState<File | null>(null)

  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([])
  const [selectedSearchAcademicYear, setSelectedSearchAcademicYear] = useState<string>("")
  const [selectedSearchSemester, setSelectedSearchSemester] = useState<string>("1")
  const [studentListData, setStudentListData] = useState<Student[]>([])
  const [isLoadingStudents, setIsLoadingStudents] = useState(false)
  const [searchQuery, setSearchQuery] = useState<string>("")

  // Add pagination states
  const [currentPage, setCurrentPage] = useState<number>(1)
  const itemsPerPage = 10 // Number of items to show per page

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [confirmModalContent, setConfirmModalContent] = useState<"student" | "project">("student")

  // Fetch configuration data for selected program
  const [configData, setConfigData] = useState<ConfigProgramSetting[]>([])
  useEffect(() => {
    if (selectedMajor === 0) {
      setLoading(false)
      return // Skip if no program is selected
    }

    const loadData = async () => {
      setLoading(true)
      try {
        const data = await getConfigProgram(selectedMajor)
        // console.log("Data Config:", data);

        if (!Array.isArray(data)) {
          throw new Error("Unexpected response format")
        }
        setConfigData(data)

        // Set semester and academic year from fetched data
        const semesterConfig = data.find((item) => item.config_name === "semester")
        const academicYearConfig = data.find((item) => item.config_name === "academic year")
        if (semesterConfig) setSemester(semesterConfig.value)
        if (academicYearConfig) setAcademicYear(academicYearConfig.value)
      } catch (err) {
        console.error("Error fetching config:", err)
        setError("Failed to load configurations.")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [selectedMajor])

  useEffect(() => {
    const fetchAcademicYears = async () => {
      try {
        const years = await getAcademicYears()
        setAcademicYears(years)
      } catch (error) {
        console.error("Error fetching academic years:", error)
      }
    }

    fetchAcademicYears()
  }, [])

  // Handler for saving changes in edit mode
  const handleSave = async () => {
    // Validate academic year
    if (!/^\d+$/.test(academicYear) || Number.parseInt(academicYear) <= 0) {
      alert("Academic year must be a positive number.")
      return
    }

    try {
      const academicYearConfig = configData.find((item) => item.config_name === "academic year")
      const semesterConfig = configData.find((item) => item.config_name === "semester")

      if (academicYearConfig) {
        await updateConfigProgram({
          ...academicYearConfig,
          value: academicYear,
        })
      }

      if (semesterConfig) {
        await updateConfigProgram({
          ...semesterConfig,
          value: semester,
        })
      }

      // console.log("Saved values - Academic Year:", academicYear, "Semester:", semester);
      alert("Update successful!")
      setIsEditMode(false) // Turn off edit mode
    } catch (error) {
      console.error("Error saving config:", error)
      setError("Failed to save configurations.")
      alert("Update failed!")
    }
  }

  // Handler for student file upload
  const handleStudentFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFile = e.target.files[0]
      const allowedTypes = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
      ]

      if (!allowedTypes.includes(selectedFile.type)) {
        alert("Please upload an Excel file.")
        return
      }

      setStudentFile(selectedFile)
    }
  }

  // Handler for project file upload
  const handleProjectFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFile = e.target.files[0]
      const allowedTypes = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
      ]

      if (!allowedTypes.includes(selectedFile.type)) {
        alert("Please upload an Excel file.")
        return
      }

      setProjectFile(selectedFile)
    }
  }

  // Handler for saving the uploaded student file
  const handleSaveStudentUpload = async () => {
    if (studentFile) {
      setConfirmModalContent("student")
      setIsConfirmModalOpen(true)
    } else {
      console.log("No student file selected for upload.")
      alert("No student file selected for upload.")
    }
  }

  // Handler for saving the uploaded project file
  const handleSaveProjectUpload = async () => {
    if (projectFile) {
      setConfirmModalContent("project")
      setIsConfirmModalOpen(true)
    } else {
      console.log("No project file selected for upload.")
      alert("No project file selected for upload.")
    }
  }

  const handleConfirmUpload = async () => {
    setIsConfirmModalOpen(false)
    try {
      if (confirmModalContent === "student" && studentFile) {
        const response = await uploadStudentList(studentFile, selectedMajor)
        console.log("Student file uploaded successfully:", response)
        alert("Student file uploaded successfully!")
        setStudentFile(null) // Clear the file input
      } else if (confirmModalContent === "project" && projectFile) {
        const response = await uploadCreateProject(projectFile, selectedMajor)
        console.log("Project file uploaded successfully:", response)
        alert("Project file uploaded successfully!")
        setProjectFile(null) // Clear the file input
      }
    } catch (error) {
      console.error("Error uploading file:", error)
      alert("Failed to upload file.")
    }
  }

  const handleFindStudents = async () => {
    if (!selectedMajor || !selectedSearchAcademicYear || !selectedSearchSemester) {
      alert("Please select all required fields")
      return
    }

    setIsLoadingStudents(true)
    try {
      const students = await getStudentsByProgram(
        selectedMajor,
        Number.parseInt(selectedSearchAcademicYear),
        Number.parseInt(selectedSearchSemester),
      )
      setStudentListData(students)
    } catch (error) {
      console.error("Error fetching students:", error)
      alert("Failed to fetch students")
    } finally {
      setIsLoadingStudents(false)
    }
  }

  // Add this new function to filter students
  const filteredStudents = studentListData.filter((student) => {
    const query = searchQuery.toLowerCase()
    return (
      student.student_id.toLowerCase().includes(query) ||
      student.first_name.toLowerCase().includes(query) ||
      student.last_name.toLowerCase().includes(query) ||
      // student.email.toLowerCase().includes(query) ||
      student.sec_lab
        .toLowerCase()
        .includes(query)
    )
  })

  // Calculate pagination values
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredStudents.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage)

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  // Reset to first page when search query changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  // Show loading or error
  if (loading) return <Spinner />
  if (error) {
    return (
      <div className="min-h-screen p-4 bg-gray-100 flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  // If no program is selected, show the NoProgramSelected component
  if (selectedMajor === 0) {
    return <NoProgramSelected />
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="space-y-4">
          {/* Config Data Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {configData.length > 0 ? (
              configData.map((item: ConfigProgramSetting, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-4">
                  <h2 className="text-sm font-medium text-gray-700">{toTitleCase(item.config_name)}</h2>

                  {item.config_name === "semester" ? (
                    isEditMode ? (
                      <>
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
                        <p className="mt-1 text-xs text-gray-500">Select the current semester.</p>
                      </>
                    ) : (
                      <>
                        <p className="mt-1 text-sm text-gray-600">{semester}</p>
                        <p className="mt-1 text-xs text-gray-500">Current semester.</p>
                      </>
                    )
                  ) : item.config_name === "academic year" ? (
                    isEditMode ? (
                      <>
                        <input
                          type="text"
                          value={academicYear}
                          onChange={(e) => setAcademicYear(e.target.value)}
                          className="mt-1.5 w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg
                                 focus:ring-2 focus:ring-primary-light focus:border-primary-light transition-colors"
                        />
                        <p className="mt-1 text-xs text-gray-500">Enter the current academic year.</p>
                      </>
                    ) : (
                      <>
                        <p className="mt-1 text-sm text-gray-600">{academicYear}</p>
                        <p className="mt-1 text-xs text-gray-500">Current academic year.</p>
                      </>
                    )
                  ) : (
                    <p className="mt-1 text-sm text-gray-600">{item.value}</p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No configuration data found for this program.</p>
            )}
          </div>

          {/* Edit/Save Buttons */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center text-yellow-600 bg-yellow-100 border border-yellow-400 p-3 rounded-lg">
              <svg
                className="w-5 h-5 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Don&apos;t forget to change the academic year and semester to the present.</span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsEditMode((prev) => !prev)}
                className={`px-4 py-2 text-sm font-medium text-white rounded-lg
                ${isEditMode ? "bg-red-600 hover:bg-red-700" : "bg-primary_button hover:bg-button_hover"}
                transition-colors duration-200`}
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
          </div>

            {/* Upload Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Upload Student Section */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-4 flex flex-col h-full">
                <div className="flex-grow">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Upload Student
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">
                    Upload a list of students to grant them permission to create
                    projects for the current academic year and semester. This
                    allows students to submit their own project details.
                  </p>
                  <p className="text-sm text-red-500 font-medium mb-3">
                    ⚠️ Please ensure you upload students with the correct
                    Academic Year and Semester. Incorrect academic period may
                    result in students being unable to access the system.
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
                        <span className="font-medium">Click to upload</span> or
                        drag and drop
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
                    <p className="mt-2 text-sm text-gray-500">
                      Selected: {studentFile.name}
                    </p>
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
                  <p className="text-sm text-gray-500 mb-2">
                    Upload projects directly as staff. Use this option to create
                    projects on behalf of students or to import existing/old
                    projects into the system.
                  </p>
                  <p className="text-sm text-red-500 font-medium mb-3">
                    ⚠️ Please verify that the Academic Year and Semester in your
                    project list match the intended academic period. Incorrect
                    values may cause projects to appear in the wrong term.
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
                        <span className="font-medium">Click to upload</span> or
                        drag and drop
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
                    <p className="mt-2 text-sm text-gray-500">
                      Selected: {projectFile.name}
                    </p>
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
                    onChange={(e) =>
                      setSelectedSearchAcademicYear(e.target.value)
                    }
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
                        <td
                          colSpan={4}
                          className="px-6 py-4 text-center text-sm text-gray-500"
                        >
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
      </div>

      {/* Confirm Modal */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4 p-6 animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Confirm Upload
            </h2>
            <div className="text-sm text-gray-600 mb-4 space-y-2">
              <p>Are you sure you want to upload the file:</p>
              <p className="font-medium pl-2">
                {confirmModalContent === "student"
                  ? studentFile?.name
                  : projectFile?.name}
              </p>
              <p>
                with Academic Year:{" "}
                <span className="font-medium text-red-600">{academicYear}</span>
              </p>
              <p>
                and Semester:{" "}
                <span className="font-medium text-red-600">{semester}</span>
              </p>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg
                         hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                onClick={() => setIsConfirmModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg
                         hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={handleConfirmUpload}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 p-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4">
              Add Asset
            </h2>
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
