"use client";
import React, { useState, useEffect } from "react";
import { fetchRecords } from "@/utils/airtable";

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchAllMajor, setSearchAllMajor] = useState<boolean>(false);
  const [records, setRecords] = useState<any[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAllRecords = async () => {
      try {
        const data = await fetchRecords("Project"); // Fetch all records from Airtable
        setRecords(data);
        setFilteredRecords(data); // Initialize filtered records
      } catch (error) {
        console.error("Error fetching records:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllRecords();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (!value) {
      setFilteredRecords(records); // Reset to all records if input is empty
      return;
    }

    const lowerCaseValue = value.toLowerCase();

    // Filter records based on multiple fields
    const filtered = records.filter((record) => {
      const { fields } = record;
      return (
        fields["ProjectTitle(EN)"]?.toLowerCase().includes(lowerCaseValue) ||
        fields["ProjectTitle(TH)"]?.toLowerCase().includes(lowerCaseValue) ||
        fields.Abstract?.toLowerCase().includes(lowerCaseValue) ||
        fields.ProjectAdvisor?.toLowerCase().includes(lowerCaseValue) ||
        fields.Student?.toLowerCase().includes(lowerCaseValue) ||
        String(fields.ID)?.toLowerCase().includes(lowerCaseValue)
      );
    });

    setFilteredRecords(filtered);
  };

  const handleCheckboxChange = () => {
    setSearchAllMajor(!searchAllMajor);
    // Logic for searching across majors can be added here
  };

  if (loading) {
    return <div>Loading records...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-4 bg-stone-100">
      <div className="w-full max-w-3xl mt-8">
        <h1 className="text-lg font-semibold mb-4 text-gray-800 text-center">
          What are you looking for?
        </h1>
        <div className="flex items-center mb-3">
          <input
            type="text"
            placeholder="Enter search term..."
            value={searchTerm}
            onChange={handleInputChange}
            className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:border-teal-500 text-sm"
          />
          <button
            className="bg-teal-500 text-white py-2 px-4 rounded-r-md hover:bg-teal-600 focus:outline-none focus:bg-teal-700 text-sm"
          >
            Search
          </button>
        </div>
        <div className="flex items-center justify-center mb-4">
          <input
            type="checkbox"
            checked={searchAllMajor}
            onChange={handleCheckboxChange}
            id="searchAllMajor"
            className="w-3.5 h-3.5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
          />
          <label htmlFor="searchAllMajor" className="ml-2 text-gray-700 text-sm">
            Search All Major
          </label>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Search Results</h2>
          {filteredRecords.length > 0 ? (
            <ul>
              {filteredRecords.map((record) => (
                <li
                  key={record.id}
                  className="mb-4 border-b border-gray-200 pb-4"
                >
                  <h3 className="text-teal-600 font-bold">
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
            <p className="text-sm text-gray-500">No records found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
