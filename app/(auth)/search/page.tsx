"use client";
import React, { useState } from "react";
import quickSearchProjects from "@/utils/search/quicksearch";
import detailSearchProjects from "@/utils/search/detailSearch"; // Import detailSearchProjects
import { Project } from "@/models/Project";
import ProjectComponent from "@/components/dashboard/ProjectComponent";
import Spinner from "@/components/Spinner"; // Import Spinner component
import Pagination from "@/components/Pagination"; // Import Pagination component

interface SearchFields {
  courseNo: string;
  projectTitle: string;
  studentNo: string;
  advisorName: string;
}

const SearchPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchMode, setSearchMode] = useState<string>("quick");
  const [searchFields, setSearchFields] = useState<SearchFields>({
    courseNo: "",
    projectTitle: "",
    studentNo: "",
    advisorName: "",
  });
  const [filteredRecords, setFilteredRecords] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(false); // State for loading
  const [currentPage, setCurrentPage] = useState<number>(1);
  const recordsPerPage = 5;

  const handleSearch = async () => {
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
        console.log("Quick search results:", results);
      } catch (error) {
        console.error("Error fetching quick search results:", error);
        setFilteredRecords([]);
      } finally {
        setLoading(false); // Set loading to false when search ends
      }
    }
  };

  const handleDetailSearch = async () => {
    setLoading(true); // Set loading to true when search starts
    try {
      const results = await detailSearchProjects({ searchFields });
      setFilteredRecords(results);
      console.log("Detailed search results:", results);
    } catch (error) {
      console.error("Error fetching detailed search results:", error);
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

      <div className="w-full max-w-5xl mt-4">
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
                className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:border-button_focus text-sm"
              />
              <button
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
