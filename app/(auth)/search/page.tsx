"use client";
import { Project } from "@/models/SearchContenetPdf";
import { fetchPdfProjects } from "@/utils/search/pdfSearchApi";
import React, { useState } from "react";

// 1. Import the PDF search API and the Project model

interface SearchFields {
  courseNo: string;
  projectTitle: string;
  studentNo: string;
  advisorName: string;
  committeeName: string;
}

const SearchPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchAllMajor, setSearchAllMajor] = useState<boolean>(false);
  const [selectedFields, setSelectedFields] = useState<string[]>([
    "ProjectTitle(EN)",
    "ProjectTitle(TH)",
    "Abstract",
    "ProjectAdvisor",
    "Student",
    "ID",
  ]);
  const [searchMode, setSearchMode] = useState<string>("quick");
  const [searchFields, setSearchFields] = useState<SearchFields>({
    courseNo: "",
    projectTitle: "",
    studentNo: "",
    advisorName: "",
    committeeName: "",
  });

  // State for showing non-PDF (quick/detail) results (UI-only placeholder)
  const [filteredRecords, setFilteredRecords] = useState<SearchFields[]>([]);

  // 2. Add state for PDF search results
  const [pdfResults, setPdfResults] = useState<Project[]>([]);

  // 3. Modify handleSearch to call the PDF API if we're in PDF mode
  const handleSearch = async () => {
    if (searchMode === "pdf") {
      try {
        const results = await fetchPdfProjects(searchTerm);
        setPdfResults(results);
      } catch (error) {
        console.error("Error fetching PDF results:", error);
        setPdfResults([]);
      }
    } else {
      // For UI-only (quick/detail), we're just clearing results to demonstrate "No records found."
      setFilteredRecords([]);
    }
  };

  const toggleSearchMode = () => {
    setSearchMode((prevMode) => {
      if (prevMode === "quick") return "detail";
      if (prevMode === "detail") return "pdf";
      return "quick";
    });
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-4 bg-stone-100">
      <div className="w-full max-w-3xl mt-8">
        <h1 className="text-lg font-semibold mb-2 text-gray-800 text-center">
          {searchMode === "quick"
            ? "Quick Search"
            : searchMode === "detail"
            ? "Detailed Search"
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

      <div className="w-full max-w-3xl mt-4">
        {/* DETAILED SEARCH */}
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
                  label: "Committee Name (EN or TH)",
                  placeholder: "e.g. Dome Potikanond",
                  value: searchFields.committeeName,
                  key: "committeeName",
                },
              ].map(({ label, placeholder, value, key }) => (
                <div key={key} className="mb-2">
                  <label className="block mb-1 text-xs font-medium">
                    {label}
                  </label>
                  <input
                    type="text"
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) =>
                      setSearchFields({
                        ...searchFields,
                        [key]: e.target.value,
                      })
                    }
                    className="w-full p-1.5 border border-gray-300 rounded focus:outline-none focus:border-button_focus text-sm"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleSearch}
                className="bg-button text-white py-1.5 px-6 rounded-md hover:bg-button_hover focus:outline-none focus:bg-button_focus text-sm"
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
                className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:border-button_focus text-sm"
              />
              <button
                onClick={handleSearch}
                className="bg-primary_button text-white py-2 px-4 rounded-r-md hover:bg-button_hover focus:outline-none focus:bg-button_focus text-sm"
              >
                Search
              </button>
            </div>
          </div>
        ) : (
          // QUICK SEARCH
          <div>
            <div className="flex items-center mb-3">
              <input
                type="text"
                placeholder="Enter search term..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:border-button_focus text-sm"
              />
              <button
                onClick={handleSearch}
                className="bg-primary_button text-white py-2 px-4 rounded-r-md hover:bg-button_hover focus:outline-none focus:bg-button_focus text-sm"
              >
                Search
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {[
                {
                  label: "Title (EN)",
                  field: "ProjectTitle(EN)",
                  color: "bg-teal-100 text-teal-800",
                },
                {
                  label: "Title (TH)",
                  field: "ProjectTitle(TH)",
                  color: "bg-blue-100 text-blue-800",
                },
                {
                  label: "Abstract",
                  field: "Abstract",
                  color: "bg-yellow-100 text-yellow-800",
                },
                {
                  label: "Advisor",
                  field: "ProjectAdvisor",
                  color: "bg-red-100 text-red-800",
                },
                {
                  label: "Student",
                  field: "Student",
                  color: "bg-purple-100 text-purple-800",
                },
                {
                  label: "ID",
                  field: "ID",
                  color: "bg-green-100 text-green-800",
                },
              ].map(({ label, field, color }) => (
                <span
                  key={field}
                  className={`inline-flex items-center px-2 py-1 text-sm font-medium rounded cursor-pointer ${
                    selectedFields.includes(field)
                      ? color
                      : "bg-gray-100 text-gray-800"
                  }`}
                  onClick={() =>
                    setSelectedFields((prevFields) =>
                      prevFields.includes(field)
                        ? prevFields.filter((f) => f !== field)
                        : [...prevFields, field]
                    )
                  }
                >
                  {label}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-center mb-4">
              <input
                type="checkbox"
                checked={searchAllMajor}
                onChange={() => setSearchAllMajor(!searchAllMajor)}
                id="searchAllMajor"
                className="w-3.5 h-3.5 text-primary_text border-gray-300 rounded focus:ring-button_focus"
              />
              <label htmlFor="searchAllMajor" className="ml-2 text-gray-700 text-sm">
                Search All Major
              </label>
            </div>
          </div>
        )}

        {/* SEARCH RESULTS */}
        <div className="bg-white rounded-lg shadow p-4 mt-4">
          <h2 className="text-lg font-semibold mb-4">Search Results</h2>
          {searchMode === "pdf" ? (
            /* PDF MODE RESULTS */
            pdfResults.length > 0 ? (
              <ul>
                {pdfResults.map((project) => (
                  <li key={project.id} className="mb-4 border-b border-gray-200 pb-4">
                    <h3 className="text-primary_button font-bold">{project.titleEN}</h3>
                    <h4 className="text-gray-700">{project.titleTH}</h4>
                    <p className="text-sm text-gray-600">
                      {project.abstractText || "No Abstract available"}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Course:</strong> {project.course?.courseNo || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Academic Year:</strong> {project.academicYear}
                    </p>
                    {/* Additional fields or logic as needed */}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">
                {searchTerm
                  ? "No PDF results found."
                  : "Enter a search term to see PDF results."}
              </p>
            )
          ) : (
            /* QUICK or DETAIL MODE RESULTS */
            filteredRecords.length > 0 ? (
              <ul>
                {filteredRecords.map((record, index) => (
                  <li
                    key={index}
                    className="mb-4 border-b border-gray-200 pb-4"
                  >
                    <h3 className="text-primary_button font-bold">Project Title (EN)</h3>
                    <h4 className="text-gray-700">Project Title (TH)</h4>
                    <p className="text-sm text-gray-600">Abstract...</p>
                    <p className="text-sm text-gray-600">
                      <strong>Advisor(s):</strong> Some advisor
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Student(s):</strong> Some student
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>ID:</strong> Some ID
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">
                {searchTerm || searchMode === "detail"
                  ? "No records found."
                  : "Enter a search term to see results."}
              </p>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
