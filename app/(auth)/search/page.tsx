"use client"
import React, { useState } from "react";

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchAllMajor, setSearchAllMajor] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCheckboxChange = () => {
    setSearchAllMajor(!searchAllMajor);
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-2 bg-gray-50">
      <div className="w-full max-w-sm p-4 bg-white rounded-md shadow-sm">
        <h1 className="text-xl font-bold mb-4 text-gray-800 text-center">Search Projects</h1>
        <div className="flex items-center mb-3">
          <input
            type="text"
            placeholder="Enter search term..."
            value={searchTerm}
            onChange={handleInputChange}
            className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-sm"
          />
          <button
            className="ml-2 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-700 text-sm"
          >
            Search
          </button>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={searchAllMajor}
            onChange={handleCheckboxChange}
            id="searchAllMajor"
            className="w-3 h-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="searchAllMajor" className="ml-2 text-gray-700 text-sm">
            Search All Major
          </label>
        </div>
      </div>
    </div>
  );
}