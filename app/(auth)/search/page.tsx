"use client";
import React, { useState, useEffect } from "react";
import { fetchRecords } from "@/utils/airtable";
import Spinner from "@/components/Spinner";

interface RecordFields {
  CourseNo?: string;
  "ProjectTitle(EN)"?: string;
  "ProjectTitle(TH)"?: string;
  Abstract?: string;
  ProjectAdvisor?: string;
  Student?: string;
  ID?: string;
  StudentNo?: string;
  CommitteeName?: string;
}

interface Record {
  id: string;
  fields: RecordFields;
}

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
  const [records, setRecords] = useState<Record[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<Record[]>([]);
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
  const [searchFields, setSearchFields] = useState<SearchFields>({
    courseNo: "",
    projectTitle: "",
    studentNo: "",
    advisorName: "",
    committeeName: "",
  });

  // Fetch records from Airtable
  useEffect(() => {
    const fetchAllRecords = async () => {
      try {
        const data: Record[] = await fetchRecords("Project");
        setRecords(data);
      } catch (error) {
        console.error("Error fetching records:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllRecords();
  }, []);

  // Handle search logic
  const handleSearch = () => {
    if (useDetailedSearch) {
      const filtered = records.filter((record) => {
        const { fields } = record;
        return (
          (!searchFields.courseNo ||
            fields.CourseNo?.toLowerCase().includes(
              searchFields.courseNo.toLowerCase()
            )) &&
          (!searchFields.projectTitle ||
            fields["ProjectTitle(EN)"]?.toLowerCase().includes(
              searchFields.projectTitle.toLowerCase()
            )) &&
          (!searchFields.studentNo ||
            fields.StudentNo?.toLowerCase().includes(
              searchFields.studentNo.toLowerCase()
            )) &&
          (!searchFields.advisorName ||
            fields.ProjectAdvisor?.toLowerCase().includes(
              searchFields.advisorName.toLowerCase()
            )) &&
          (!searchFields.committeeName ||
            fields.CommitteeName?.toLowerCase().includes(
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
          fields[field as keyof RecordFields]
            ?.toString()
            .toLowerCase()
            .includes(lowerCaseValue)
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
    return <Spinner />;
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
                      setSearchFields({ ...searchFields, [key]: e.target.value })
                    }
                    className="w-full p-1.5 border border-gray-300 rounded focus:outline-none focus:border-red-800 text-sm"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleSearch}
                className="bg-red-700 text-white py-1.5 px-6 rounded-md hover:bg-red-800 focus:outline-none focus:bg-red-900 text-sm"
              >
                Search
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center mb-3">
              <input
                type="text"
                placeholder="Enter search term..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:border-red-800 text-sm"
              />
              <button
                onClick={handleSearch}
                className="bg-red-700 text-white py-2 px-4 rounded-r-md hover:bg-red-800 focus:outline-none focus:bg-red-900 text-sm"
              >
                Search
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {[
                { label: "Title (EN)", field: "ProjectTitle(EN)", color: "bg-teal-100 text-teal-800" },
                { label: "Title (TH)", field: "ProjectTitle(TH)", color: "bg-blue-100 text-blue-800" },
                { label: "Abstract", field: "Abstract", color: "bg-yellow-100 text-yellow-800" },
                { label: "Advisor", field: "ProjectAdvisor", color: "bg-red-100 text-red-800" },
                { label: "Student", field: "Student", color: "bg-purple-100 text-purple-800" },
                { label: "ID", field: "ID", color: "bg-green-100 text-green-800" },
              ].map(({ label, field, color }) => (
                <span
                  key={field}
                  className={`inline-flex items-center px-2 py-1 text-sm font-medium rounded cursor-pointer ${
                    selectedFields.includes(field) ? color : "bg-gray-100 text-gray-800"
                  }`}
                  onClick={() => toggleFieldSelection(field)}
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
                className="w-3.5 h-3.5 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <label htmlFor="searchAllMajor" className="ml-2 text-gray-700 text-sm">
                Search All Major
              </label>
            </div>
          </div>
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
