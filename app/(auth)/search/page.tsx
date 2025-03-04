"use client";
import React, { useState, useEffect } from "react";
import quickSearchProjects from "@/utils/search/quicksearch";
import detailSearchProjects from "@/utils/search/detailSearch"; // Import detailSearchProjects
import { Project } from "@/models/Project";
import ProjectComponent from "@/components/dashboard/ProjectComponent";
import Spinner from "@/components/Spinner"; // Import Spinner component
import Pagination from "@/components/Pagination"; // Import Pagination component
import { AllProgram } from "@/models/AllPrograms";
import getAllProgram from "@/utils/getAllProgram";

interface SearchFields {
  courseNo: string | null;
  projectTitle: string | null;
  studentNo: string | null;
  advisorName: string | null;
  academicYear: string | null;
  semester: string | null;
  programId: number ;
}

const SearchPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchMode, setSearchMode] = useState<string>("quick");
  const [searchFields, setSearchFields] = useState<SearchFields>({
    courseNo: null,
    projectTitle: null,
    studentNo: null,
    advisorName: null,
    academicYear: null,
    semester: null,
    programId: 0,
  });
  const [filteredRecords, setFilteredRecords] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(false); // State for loading
  const [currentPage, setCurrentPage] = useState<number>(1);
  const recordsPerPage = 5;
  const [programOptions, setProgramOptions] = useState<AllProgram[]>([]); // State for program options

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const programs = await getAllProgram(); // Fetch program options
        setProgramOptions(programs);
      } catch (error) {
        console.error("Error fetching program options:", error);
      }
    };

    fetchPrograms();
  }, []);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      alert("Please enter a search term.");
      return;
    }
    setLoading(true); // Set loading to true when search starts
    if (searchMode === "quick") {
      try {
        const results = await quickSearchProjects({
          searchInput: searchTerm,
          fields: [
            "titleTH",
            "titleEN",
            "abstractText",
            "staffs.firstNameTH",
            "staffs.lastNameTH",
            "staffs.firstNameEN",
            "staffs.lastNameEN",
            "members.studentId",
            "members.firstName",
            "members.lastName",
          ],
        });
        setFilteredRecords(results);
        // console.log("Quick search results:", results);
      } catch (error) {
        console.error("Error fetching quick search results:", error);
        setFilteredRecords([]);
      } finally {
        setLoading(false); // Set loading to false when search ends
      }
    }
  };

  const handleDetailSearch = async () => {
    if (
      !(searchFields.courseNo?.trim()) &&
      !(searchFields.projectTitle?.trim()) &&
      !(searchFields.studentNo?.trim()) &&
      !(searchFields.advisorName?.trim()) &&
      !searchFields.academicYear?.trim() &&
      !searchFields.semester?.trim() &&
      searchFields.programId === 0
    ) {
      alert("Please fill in at least one search field.");
      return;
    }
    setLoading(true); // Set loading to true when search starts
    try {
      const results = await detailSearchProjects({ searchFields });
      setFilteredRecords(results);
      console.log("Advanced search results:", results);
    } catch (error) {
      console.error("Error fetching advanced search results:", error);
      setFilteredRecords([]);
    } finally {
      setLoading(false); // Set loading to false when search ends
    }
  };

  const toggleSearchMode = () => {
    setSearchMode((prevMode) => {
      if (prevMode === "quick") return "detail";
      if (prevMode === "detail") return "pdf";
      return "quick";
    });
    setSearchTerm("");
    setSearchFields({
      courseNo: "",
      projectTitle: "",
      studentNo: "",
      advisorName: "",
      academicYear: "",
      semester: "",
      programId: 0,
    });
    setFilteredRecords([]);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top
  };

  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const getSearchModeStyle = () => {
    switch (searchMode) {
      case "quick":
        return "bg-blue-200";
      case "detail":
        return "bg-green-200";
      case "pdf":
        return "bg-yellow-200";
      default:
        return "";
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      if (searchMode === "quick") {
        handleSearch();
      } else if (searchMode === "detail") {
        handleDetailSearch();
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-4 bg-gray-50">
      <div className=" max-w-3xl mt-8">
        <h1
          className={`text-lg font-semibold mb-2 text-gray-800 text-center ${getSearchModeStyle()}`}
        >
          {searchMode === "quick"
            ? "Quick Search"
            : searchMode === "detail"
            ? "Advanced Search"
            : "PDF Search"}
        </h1>
        <button
          onClick={toggleSearchMode}
          className="block text-primary_button text-sm font-medium mx-auto hover:underline focus:outline-none focus:underline"
          aria-label="Switch Search Mode"
        >
          Switch Search Mode
        </button>
      </div>

      <div className="w-full max-w-5xl mt-4">
        {/* ADVANCED SEARCH */}
        {searchMode === "detail" ? (
          <div className="bg-white rounded-lg p-3 shadow mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                {
                  label: "Course No.",
                  placeholder: "e.g. 261492",
                  value: searchFields.courseNo,
                  key: "courseNo",
                },
                {
                  label: "Project Title (EN or TH)",
                  placeholder: "e.g. Project Box",
                  value: searchFields.projectTitle,
                  key: "projectTitle",
                },
                {
                  label: "Student No.",
                  placeholder: "e.g. 640610633",
                  value: searchFields.studentNo,
                  key: "studentNo",
                },
                {
                  label: "Advisor Name (EN or TH)",
                  placeholder: "e.g. Pichayoot Hunchainao",
                  value: searchFields.advisorName,
                  key: "advisorName",
                },
                {
                  label: "Academic Year",
                  placeholder: "e.g. 2568",
                  value: searchFields.academicYear,
                  key: "academicYear",
                },
                {
                  label: "Semester",
                  placeholder: "Select Semester",
                  value: searchFields.semester,
                  key: "semester",
                  type: "dropdown",
                  options: [
                    { value: "", label: "Select Semester" },
                    { value: "1", label: "1" },
                    { value: "2", label: "2" },
                    { value: "3", label: "3 (Summer)" },
                  ],
                },
                {
                  label: "Program",
                  placeholder: "Select Program",
                  value: searchFields.programId,
                  key: "programId",
                  type: "dropdown",
                  options: [
                    { value: "", label: "Select Program" },
                    ...programOptions.map((program) => ({
                      value: program.id,
                      label: program.program_name_en,
                    })),
                  ],
                },
              ].map(({ label, placeholder, value, key, type, options }) => (
                <div key={key} className="mb-2">
                  <label className="block mb-1 text-xs font-medium">
                    {label}
                  </label>
                  {type === "dropdown" ? (
                    <select
                      value={value ?? ""}
                      onChange={(e) =>
                        setSearchFields({
                          ...searchFields,
                          [key]: e.target.value,
                        })
                      }
                      className="w-full p-1.5 border border-gray-300 rounded focus:outline-none focus:border-button_focus text-sm"
                    >
                      {options?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      placeholder={placeholder}
                      value={value ?? ""}
                      onChange={(e) =>
                        setSearchFields({
                          ...searchFields,
                          [key]: e.target.value,
                        })
                      }
                      onKeyPress={handleKeyPress} // Add this line
                      className="w-full p-1.5 border border-gray-300 rounded focus:outline-none focus:border-button_focus text-sm"
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleDetailSearch}
                className="bg-primary_button text-white py-1.5 px-6 rounded-md hover:bg-button_hover focus:outline-none focus:bg-button_focus text-sm"
              >
                Search
              </button>
            </div>
          </div>
        ) : searchMode === "pdf" ? (
          // PDF SEARCH
          <div>
            <div className="flex items-center mb-3">
              <input
                type="text"
                placeholder="Enter search term..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress} // Add this line
                className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:border-button_focus text-sm"
              />
              <button
                className="bg-primary_button text-white py-2 px-4 rounded-r-md hover:bg-button_hover focus:outline-none focus:bg-button_focus text-sm"
              >
                Search
              </button>
            </div>
            <div className="text-sm text-gray-600 mb-4 px-2">
              <p>Search within PDF content of all projects. Results will show projects containing your search terms in their PDF documents.</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Searches PDF Content
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Matches Project Details
                </span>
              </div>
            </div>
          </div>
        ) : (
          // QUICK SEARCH
          <div>
            <div className="flex items-center mb-2">
              <input
                type="text"
                placeholder="Enter search term..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:border-button_focus text-sm"
              />
              <button
                onClick={handleSearch}
                className="bg-primary_button text-white py-2 px-4 rounded-r-md hover:bg-button_hover focus:outline-none focus:bg-button_focus text-sm"
              >
                Search
              </button>
            </div>
            <div className="flex flex-wrap gap-2 px-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Project Title TH/EN
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                Description
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                Student ID/Name
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Advisor Name TH/EN
              </span>
            </div>
          </div>
        )}

        {/* SEARCH RESULTS */}
        <div className="bg-white rounded-lg shadow p-4 mt-4 w-full max-w-5xl"> {/* Increased max-width */}
          <h2 className="text-lg font-semibold mb-4">Search Results</h2>
          {loading ? (
            <Spinner /> // Show spinner when loading
          ) : filteredRecords.length > 0 ? (
            <>
              <ul>
                {paginatedRecords.map((record) => (
                  <li key={record.id}>
                    <ProjectComponent project={record} />
                  </li>
                ))}
              </ul>
              <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(filteredRecords.length / recordsPerPage)}
                  onPageChange={handlePageChange}             />
            </>
          ) : (
            <p className="text-sm text-gray-500">
              {searchTerm ? "No records found." : "Enter a search term to see results."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
