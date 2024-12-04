import React from "react";

export default function AdminManagePage() {
  // Mock data with random 4-digit IDs
  const mockData = [
    {
      id: Math.floor(1000 + Math.random() * 9000),
      email: "pichayoot.h@cmu.ac.th",
    },
    {
      id: Math.floor(1000 + Math.random() * 9000),
      email: "nathapong.p@cmu.ac.th",
    },
    {
      id: Math.floor(1000 + Math.random() * 9000),
      email: "thanawin.s@cmu.ac.th",
    },
    {
      id: Math.floor(1000 + Math.random() * 9000),
      email: "nirand.p@cmu.ac.th",
    },
  ];

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-4">
        <h1 className="text-lg font-semibold text-gray-800 mb-3">Admin Manage</h1>
        <div className="flex items-center space-x-2 mb-6">
          <input
            type="email"
            placeholder="CMU Account"
            className="w-96 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
          />
          <button
            className="px-4 py-1 bg-teal-500 text-white font-medium rounded hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
          >
            Add
          </button>
        </div>

        {/* Table Section */}
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">ID</th>
                <th scope="col" className="px-6 py-3">CMU Account</th>
                <th scope="col" className="px-3 py-3 text-center w-24">Action</th>
              </tr>
            </thead>
            <tbody>
              {mockData.map((item) => (
                <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{item.id}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{item.email}</td>
                  <td className="px-3 py-4 text-center">
                    <button className="text-blue-600 hover:underline">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
