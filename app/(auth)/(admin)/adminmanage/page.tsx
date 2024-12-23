"use client";
import { fetchAdminConfig } from "@/utils/airtableConfigAdmin";
import React, { useEffect, useState } from "react";

type Admin = {
  id: number;
  email: string;
};

export default function AdminManagePage(): JSX.Element {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [email, setEmail] = useState<string>("");
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);

  useEffect(() => {
    async function loadData() {
      const data = await fetchAdminConfig();
      setAdmins(data);
    }
    loadData();
  }, []);

  const handleAddAdmin = async () => {
    if (email) {
      try {
        await addAdminConfig(email);
        setAdmins([...admins, { id: admins.length + 1, email }]);
        setEmail("");
      } catch (error) {
        console.error("Failed to add admin:", error);
      }
    }
  };

  const handleDeleteClick = (admin: Admin) => {
    setSelectedAdmin(admin);
  };

  const handleConfirmDelete = async () => {
    if (selectedAdmin) {
      try {
        setAdmins(admins.filter((admin) => admin.id !== selectedAdmin.id));
        setSelectedAdmin(null);
      } catch (error) {
        console.error("Failed to delete admin:", error);
      }
    }
  };

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-4">
        <h1 className="text-lg font-semibold text-gray-800 mb-3">
          Admin Manage
        </h1>
        <div className="flex items-center space-x-2 mb-6">
          <input
            type="email"
            placeholder="CMU Account"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-96 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-800 text-sm"
          />
          <button
            onClick={handleAddAdmin}
            className="px-4 py-1 bg-red-700 text-white font-medium rounded hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-900 text-sm"
          >
            Add
          </button>
        </div>

        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">
                  ID
                </th>
                <th scope="col" className="px-6 py-3">
                  CMU Account
                </th>
                <th scope="col" className="px-3 py-3 text-center w-24">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {admins.map((item) => (
                <tr
                  key={item.id}
                  className="bg-white border-b hover:bg-gray-50"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {item.id}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {item.email}
                  </td>
                  <td className="px-3 py-4 text-center">
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => handleDeleteClick(item)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-end p-2">
              <button
                onClick={() => setSelectedAdmin(null)}
                className="text-gray-400 hover:bg-gray-200 rounded-full p-1 focus:outline-none"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-6 text-center">
              {/* Updated Red SVG Icon */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mx-auto mb-4 w-12 h-12 text-red-600"
              >
                <path
                  d="M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16zM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12z"
                  fill="currentColor"
                ></path>
                <path
                  d="M12 14a1 1 0 0 1-1-1V7a1 1 0 1 1 2 0v6a1 1 0 0 1-1 1zm-1.5 2.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0z"
                  fill="currentColor"
                ></path>
              </svg>
              <h3 className="mb-5 text-lg font-medium text-gray-800">
                Are you sure you want to delete{" "}
                <span className="text-red-600 font-semibold">
                  "{selectedAdmin.email}"?
                </span>
              </h3>
              <button
                onClick={handleConfirmDelete}
                className="text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setSelectedAdmin(null)}
                className="ml-3 text-gray-700 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg focus:outline-none"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function addAdminConfig(email: string) {
  throw new Error("Function not implemented.");
}
