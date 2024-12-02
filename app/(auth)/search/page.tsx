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
    <div className="flex flex-col items-center justify-center min-h-screen p-2 bg-stone-100">
      <div className="w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          What are you looking for?
        </h1>
        <div className="flex items-center mb-4">
          <input
            type="text"
            placeholder="Enter search term..."
            value={searchTerm}
            onChange={handleInputChange}
            className="flex-grow p-3 border border-gray-300 rounded-l-md focus:outline-none focus:border-teal-500 text-base"
          />
          <button
            className="bg-teal-500 text-white py-3 px-6 rounded-r-md hover:bg-teal-600 focus:outline-none focus:bg-teal-700 text-base"
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
            className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
          />
          <label htmlFor="searchAllMajor" className="ml-2 text-gray-700 text-base">
            Search All Major
          </label>
        </div>
      </div>
    </div>
  );
}