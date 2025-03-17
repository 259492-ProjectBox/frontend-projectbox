"use client";
import React, { useState, useEffect } from "react";
import quickSearchProjects from "@/app/api/search/quicksearch";
import detailSearchProjects from "@/app/api/search/detailSearch"; // Import detailSearchProjects
import { Project } from "@/models/Project";
import ProjectComponent from "@/components/dashboard/ProjectComponent";
import Spinner from "@/components/Spinner"; // Import Spinner component
import Pagination from "@/components/Pagination"; // Import Pagination component
import { AllProgram } from "@/models/AllPrograms";
import getAllProgram from "@/utils/getAllProgram";
import { fetchPdfProjects } from "@/app/api/search/pdfSearchApi"; // Import fetchPdfProjects
import { getAcademicYears } from "@/app/api/configprogram/getAcademicYears"; // Import getAcademicYears
import { AcademicYear } from "@/models/AcademicYear"; // Import AcademicYear
import keywordSearchProjects, { KeywordSearchFields } from "@/app/api/search/keywordSearch"; // Import keywordSearchProjects
import { Keyword } from "@/dtos/Keyword";
import getAllKeyWord from "@/app/api/keywords/getAllKeyWord";
import { Autocomplete, TextField } from "@mui/material";
import { getProgramNameById } from "@/utils/programHelpers";

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
  const [hasSearched, setHasSearched] = useState<boolean>(false);
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
  const [searchableFields, setSearchableFields] = useState({
    title: true,
    description: true,
    student: true,
    advisor: true
  });
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]); // State for academic years

  const [keywords ,setKeywords] = useState<Keyword[]>();
  const [selectedKeyword, setSelectedKeyword] = useState<KeywordSearchFields>({keyword_id: 0});
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
    loadKeywords();
  }, []);

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

  const loadKeywords = async () => {
    try {
      
      const keywords = await getAllKeyWord();
      setKeywords(keywords);
    } catch (error) {
      console.error("Error fetching keywords:", error);
    }
  }
  const toggleSearchField = (field: keyof typeof searchableFields) => {
    setSearchableFields(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      alert("Please enter a search term.");
      return;
    }
    setLoading(true);
    setHasSearched(true);
    if (searchMode === "quick") {
      try {
        const searchFields = [];
        if (searchableFields.title) {
          searchFields.push("titleTH", "titleEN");
        }
        if (searchableFields.description) {
          searchFields.push("abstractText");
        }
        if (searchableFields.student) {
          searchFields.push("members.studentId", "members.firstName", "members.lastName");
        }
        if (searchableFields.advisor) {
          searchFields.push("staffs.firstNameTH", "staffs.lastNameTH", "staffs.firstNameEN", "staffs.lastNameEN");
        }

        const results = await quickSearchProjects({
          searchInput: searchTerm,
          fields: searchFields,
        });
        setFilteredRecords(results);
      } catch (error) {
        console.error("Error fetching quick search results:", error);
        setFilteredRecords([]);
      } finally {
        setLoading(false);
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
    setLoading(true);
    setHasSearched(true);
    try {
      const results = await detailSearchProjects({ searchFields });
      setFilteredRecords(results);
      // console.log("Advanced search results:", results);
    } catch (error) {
      console.error("Error fetching advanced search results:", error);
      setFilteredRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchPDF = async () => {
    if (!searchTerm.trim()) {
      alert("Please enter a search term.");
      return;
    }
    setLoading(true);
    setHasSearched(true);
    try {
      const results = await fetchPdfProjects(searchTerm);
      setFilteredRecords(results);
      // console.log("PDF search results:", results);
    } catch (error) {
      console.error("Error fetching PDF search results:", error);
      setFilteredRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeywordSearch = async () => {
    if (selectedKeyword.keyword_id === 0) {
      alert("Please select a keyword.");
      return;
    }
    setLoading(true);
    setHasSearched(true);
    try {
      const results = await keywordSearchProjects({ searchFields: selectedKeyword });
      setFilteredRecords(results);
    } catch (error) {
      console.error("Error fetching keyword search results:", error);
      setFilteredRecords([]);
    } finally {
      setLoading(false);
    }
  };

  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top
  };

  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      if (searchMode === "quick") {
        handleSearch();
      } else if (searchMode === "detail") {
        handleDetailSearch();
      } else if (searchMode === "pdf") {
        handleSearchPDF(); // Add this line
      } else if (searchMode === "keyword") {
        loadKeywords();
        handleKeywordSearch();
      }
    }
  };

  // Reset hasSearched when changing search mode
  useEffect(() => {
    setHasSearched(false);
  }, [searchMode]);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-4 bg-gray-50">
      <div className="max-w-3xl mt-2">
        {/* Mobile dropdown */}
        <div className="sm:hidden mb-4">
          <label htmlFor="searchMode" className="sr-only">Select search mode</label>
          <select 
            id="searchMode" 
            value={searchMode}
            onChange={(e) => {
              setSearchMode(e.target.value as "quick" | "detail" | "pdf" | "keyword");
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
            }}
            className="block w-full py-2 px-3 text-sm rounded-lg border border-gray-200 bg-white focus:ring-1 focus:ring-gray-200 focus:border-gray-200"
          >
            <option value="quick">Quick Search</option>
            <option value="detail">Advanced Search</option>
            <option value="pdf">PDF Search</option>
            <option value="keyword">Keyword Search</option>
          </select>
        </div>

        {/* Desktop tabs */}
        <div className="hidden sm:flex rounded-lg bg-white border border-gray-200 p-1 text-sm">
          <button
            onClick={() => {
              setSearchMode("quick");
              setSearchTerm("");
              setFilteredRecords([]);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors duration-200 ${
              searchMode === "quick"
                ? "bg-[#BBE3F1] text-black"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span>Quick Search</span>
          </button>
          <button
            onClick={() => {
              setSearchMode("detail");
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
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors duration-200 ${
              searchMode === "detail"
                ? "bg-[#9AE79C] text-black"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
            <span>Advanced Search</span>
          </button>
          <button
            onClick={() => {
              setSearchMode("pdf");
              setSearchTerm("");
              setFilteredRecords([]);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors duration-200 ${
              searchMode === "pdf"
                ? "bg-[#FEF38B] text-black"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <span>PDF Search</span>
          </button>
          <button
            onClick={() => {
              setSearchMode("keyword");
              setSearchTerm("");
              setFilteredRecords([]);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors duration-200 ${
              searchMode === "keyword"
                ? "bg-[#f5c462] text-black"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 key-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
</svg>

            <style jsx>{`
              .key-icon {
                stroke: #000; /* Change the color to black */
                transform: rotate(90deg); /* Rotate the icon to make it look like a key */
              }
            `}</style>
            <span>Keyword Search</span>
          </button>
        </div>
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
                  placeholder: "Select Academic Year",
                  value: searchFields.academicYear,
                  key: "academicYear",
                  type: "dropdown",
                  options: [
                    { value: "", label: "Select Academic Year" },
                    ...academicYears.map((year) => ({
                      value: year.year_be,
                      label: year.year_be,
                    })),
                  ],
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
                onClick={handleSearchPDF} // Add this line
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
        ) : searchMode === "keyword" ? (
          // KEYWORD SEARCH
          <div>
      <div className="flex items-center mb-2">
      <Autocomplete
      className="flex-grow"
        options={(keywords ?? []).sort((a, b) => -b.keyword.localeCompare(a.keyword))}
        groupBy={(option) => {
          const programName = getProgramNameById(option.program_id, programOptions);
          return programName ? programName : option.program_id.toString();
        }}
        getOptionLabel={(option) => option.keyword}
        sx={{
          width: 300,
          "& .MuiInputBase-root": { height: 36 }, // Adjust input height
          "& .MuiOutlinedInput-root": { padding: "4px" }, // Reduce padding inside input
        }}
        slotProps={
          {
            listbox: { sx: { maxHeight: "200px",  "& .MuiAutocomplete-option": { padding: "4px 8px", fontSize: "14px" },} },
          }
        }
  
        onChange={(_event, value) => setSelectedKeyword({ keyword_id: value?.id ?? 0 })}
        renderGroup={(params) => (
          <div key={params.key}>
            <div
              style={{
                backgroundColor: "#f0f0f0",
                fontWeight: "bold",
                padding: "6px 10px",
                fontSize: "14px",
              }}
            >
              {params.group}
            </div>
            {params.children}
          </div>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Enter keyword..."
            className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:border-button_focus text-sm"
          />
        )}
        />

        <button
          onClick={handleKeywordSearch}
          className="bg-primary_button text-white py-2 px-4 rounded-r-md hover:bg-button_hover focus:outline-none focus:bg-button_focus text-sm"
        >
          Search
        </button>
      </div>
      <div className="text-sm text-gray-600 mb-3 px-2">
        <p>Search projects by keyword. Results will show projects containing your search terms in their keywords.</p>
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
                // onKeyPress={handleKeyPress}
                onKeyDown={handleKeyPress} // Change this line
                className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:border-button_focus text-sm"
              />
              <button
                onClick={handleSearch}
                className="bg-primary_button text-white py-2 px-4 rounded-r-md hover:bg-button_hover focus:outline-none focus:bg-button_focus text-sm"
              >
                Search
              </button>
            </div>
            <div className="text-sm text-gray-600 mb-3 px-2">
              <p>Quick search allows you to search across multiple fields. Click on badges below to toggle search fields.</p>
            </div>
            <div className="flex flex-wrap gap-2 px-2">
              <button
                onClick={() => toggleSearchField('title')}
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-200 ${
                  searchableFields.title ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-500'
                }`}
              >
                Project Title TH/EN
              </button>
              <button
                onClick={() => toggleSearchField('description')}
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-200 ${
                  searchableFields.description ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-500'
                }`}
              >
                Description
              </button>
              <button
                onClick={() => toggleSearchField('student')}
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-200 ${
                  searchableFields.student ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-500'
                }`}
              >
                Student ID/Name
              </button>
              <button
                onClick={() => toggleSearchField('advisor')}
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-200 ${
                  searchableFields.advisor ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-500'
                }`}
              >
                Advisor Name TH/EN
              </button>
            </div>
          </div>
        )}

        {/* SEARCH RESULTS */}
        {hasSearched && (
          <div className="bg-white rounded-lg shadow p-4 mt-4 w-full max-w-5xl">
            <h2 className="text-lg font-semibold mb-4">Search Results</h2>
            {loading ? (
              <Spinner />
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
                  onPageChange={handlePageChange}
                />
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 text-lg">No Result</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
