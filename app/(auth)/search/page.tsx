"use client";
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
    <div className="flex flex-col items-center justify-start min-h-screen p-4 bg-stone-100">
      <div className="w-full max-w-md mt-8">
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
        <div className="flex items-center justify-center">
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
      </div>
    </div>
  );
}
