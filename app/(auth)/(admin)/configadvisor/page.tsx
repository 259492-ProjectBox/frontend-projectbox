import React from "react";

export default function ConfigAdvisorPage() {
  return (
    <div className="min-h-screen p-4 bg-stone-100">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-4">
        <h1 className="text-lg font-semibold text-gray-800 mb-3">Config Advisor</h1>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Position"
            className="w-32 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
          />
          <input
            type="text"
            placeholder="Name"
            className="w-96 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
          />
          <button
            className="px-4 py-1 bg-teal-500 text-white font-medium rounded hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
