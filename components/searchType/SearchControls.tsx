"use client";
import React, { useState } from "react";
import ExpandIcon from "@mui/icons-material/Expand";

interface SearchControlsProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleSearch: () => void;
  selectedFields: string[];
  toggleFieldSelection: (field: string) => void;
  searchAllMajor: boolean;
  setSearchAllMajor: (value: boolean) => void;
}

const SearchControls: React.FC<SearchControlsProps> = ({
  searchTerm,
  setSearchTerm,
  handleSearch,
  selectedFields,
  toggleFieldSelection,
  searchAllMajor,
  setSearchAllMajor,
}) => {
  return (
    <div>
      <div className="flex items-center mb-3">
        <input
          type="text"
          placeholder="Enter search term..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:border-teal-500 text-sm"
        />
        <button
          onClick={handleSearch}
          className="bg-teal-500 text-white py-2 px-4 rounded-r-md hover:bg-teal-600 focus:outline-none focus:bg-teal-700 text-sm"
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
          className="w-3.5 h-3.5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
        />
        <label htmlFor="searchAllMajor" className="ml-2 text-gray-700 text-sm">
          Search All Major
        </label>
      </div>
    </div>
  );
};

export default SearchControls;
