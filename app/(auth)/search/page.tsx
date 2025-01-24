"use client";
import React, { useState, useEffect } from "react";
import { fetchRecords } from "@/utils/airtable";
import SearchControls from "@/components/searchType/SearchControls";
// import PDFSearchControls from "@/components/searchType/PDFSearchControls";
import DetailedSearchControls from "@/components/searchType/DetailedSearchControls";
import Spinner from "@/components/Spinner";

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchAllMajor, setSearchAllMajor] = useState<boolean>(false);
  const [records, setRecords] = useState<any[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<any[]>([]);
  const [selectedFields, setSelectedFields] = useState<string[]>([
    "ProjectTitle(EN)",
    "ProjectTitle(TH)",
    "Abstract",
    "ProjectAdvisor",
    "Student",
    "ID",
  ]);
  const [loading, setLoading] = useState<boolean>(true);
  const [useDetailedSearch, setUseDetailedSearch] = useState<boolean>(false);
  const [searchFields, setSearchFields] = useState({
    courseNo: "",
    projectTitle: "",
    studentNo: "",
    advisorName: "",
    committeeName: "",
  });

  useEffect(() => {
    const fetchAllRecords = async () => {
      try {
        const data = await fetchRecords("Project");
        setRecords(data);
      } catch (error) {
        console.error("Error fetching records:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllRecords();
  }, []);

  const handleSearch = () => {
    if (useDetailedSearch) {
      const filtered = records.filter((record) => {
        const { fields } = record;

        return (
          (!searchFields.courseNo ||
            fields["CourseNo"]?.toLowerCase().includes(
              searchFields.courseNo.toLowerCase()
            )) &&
          (!searchFields.projectTitle ||
            fields["ProjectTitle(EN)"]?.toLowerCase().includes(
              searchFields.projectTitle.toLowerCase()
            )) &&
          (!searchFields.studentNo ||
            fields["StudentNo"]?.toLowerCase().includes(
              searchFields.studentNo.toLowerCase()
            )) &&
          (!searchFields.advisorName ||
            fields["ProjectAdvisor"]?.toLowerCase().includes(
              searchFields.advisorName.toLowerCase()
            )) &&
          (!searchFields.committeeName ||
            fields["CommitteeName"]?.toLowerCase().includes(
              searchFields.committeeName.toLowerCase()
            ))
        );
      });

      setFilteredRecords(filtered);
    } else {
      if (!searchTerm) {
        setFilteredRecords([]);
        return;
      }

      const lowerCaseValue = searchTerm.toLowerCase();

      const filtered = records.filter((record) => {
        const { fields } = record;
        return selectedFields.some((field) =>
          String(fields[field])?.toLowerCase().includes(lowerCaseValue)
        );
      });

      setFilteredRecords(filtered);
    }
  };

  const toggleFieldSelection = (field: string) => {
    setSelectedFields((prevFields) =>
      prevFields.includes(field)
        ? prevFields.filter((f) => f !== field)
        : [...prevFields, field]
    );
  };

  if (loading) {
    return <Spinner/>
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-4 bg-stone-100">
      <div className="w-full max-w-3xl mt-8">
        <h1 className="text-lg font-semibold mb-2 text-gray-800 text-center">
          {useDetailedSearch ? "Detailed Search" : "Quick Search"}
        </h1>
        <button
          onClick={() => setUseDetailedSearch(!useDetailedSearch)}
          className="block text-red-700 text-sm font-medium mx-auto hover:underline focus:outline-none focus:underline"
          aria-label="Switch Search Method"
        >
          Switch Search Mode
        </button>
      </div>
      <div className="w-full max-w-3xl mt-4">
        {useDetailedSearch ? (
          <DetailedSearchControls
            searchFields={searchFields}
            setSearchFields={setSearchFields}
            handleSearch={handleSearch}
          />
        ) : (
          <SearchControls
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            handleSearch={handleSearch}
            selectedFields={selectedFields}
            toggleFieldSelection={toggleFieldSelection}
            searchAllMajor={searchAllMajor}
            setSearchAllMajor={setSearchAllMajor}
          />
        )}
        <div className="bg-white rounded-lg shadow p-4 mt-4">
          <h2 className="text-lg font-semibold mb-4">Search Results</h2>
          {filteredRecords.length > 0 ? (
            <ul>
              {filteredRecords.map((record) => (
                <li
                  key={record.id}
                  className="mb-4 border-b border-gray-200 pb-4"
                >
                  <h3 className="text-red-700 font-bold">
                    {record.fields["ProjectTitle(EN)"] || "No Title (EN)"}
                  </h3>
                  <h4 className="text-gray-700">
                    {record.fields["ProjectTitle(TH)"] || "No Title (TH)"}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {record.fields.Abstract || "No Abstract Available"}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Advisor(s):</strong>{" "}
                    {record.fields.ProjectAdvisor || "None"}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Student(s):</strong>{" "}
                    {record.fields.Student || "None"}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>ID:</strong> {record.fields.ID || "N/A"}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">
              {searchTerm || useDetailedSearch
                ? "No records found."
                : "Enter a search term to see results."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
