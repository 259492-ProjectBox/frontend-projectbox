"use client";
import React, { useEffect, useState } from "react";
import { Advisor } from "@/models/Advisor";
import Spinner from "@/components/Spinner";
import postCreateAdvisor from "@/utils/configadvisor/postCreateAdvisor";
import getEmployeeByMajorId from "@/utils/advisorstats/getEmployeebyMajorId";

export default function ConfigAdvisorPage() {
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // State for modal visibility
  const [isEditMode, setIsEditMode] = useState<boolean>(false); // To differentiate between add and edit modes
  const [selectedAdvisor, setSelectedAdvisor] = useState<Advisor | null>(null); // Selected advisor for editing

  // States for form inputs
  const [prefix, setPrefix] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    const fetchAdvisors = async () => {
      try {
        const data: Advisor[] = await getEmployeeByMajorId(1); // Pass the desired Major ID
        setAdvisors(data);
      } catch (err) {
        console.error("Error fetching advisors:", err);
        setError("Failed to load advisors.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdvisors();
  }, []);

  const handleOpenModal = (advisor: Advisor | null = null) => {
    setIsEditMode(!!advisor); // Determine mode
    setSelectedAdvisor(advisor);
    if (advisor) {
      setPrefix(advisor.prefix);
      setFirstName(advisor.first_name);
      setLastName(advisor.last_name);
      setEmail(advisor.email);
    } else {
      setPrefix("");
      setFirstName("");
      setLastName("");
      setEmail("");
    }
    setIsModalOpen(true);
  };

  const handleSaveAdvisor = async () => {
    try {
      if (isEditMode && selectedAdvisor) {
        // Update logic (assuming you have a function to update an advisor)
        const updatedAdvisor = {
          ...selectedAdvisor,
          prefix,
          first_name: firstName,
          last_name: lastName,
          email,
        };
        setAdvisors((prev) =>
          prev.map((advisor) =>
            advisor.id === selectedAdvisor.id ? updatedAdvisor : advisor
          )
        );
        alert("Advisor updated successfully!");
      } else {
        // Create logic
        const newAdvisorPayload = {
          prefix,
          first_name: firstName,
          last_name: lastName,
          email,
          major_id: 1,
        };
        const newAdvisor = await postCreateAdvisor(newAdvisorPayload);
        setAdvisors((prev) => [...prev, newAdvisor]);
        alert("Advisor created successfully!");
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error saving advisor:", err);
      alert("Failed to save advisor.");
    }
  };

  const handleDeleteAdvisor = async () => {
    try {
      if (selectedAdvisor) {
        // Assuming you have a function to delete an advisor
        setAdvisors((prev) =>
          prev.filter((advisor) => advisor.id !== selectedAdvisor.id)
        );
        alert("Advisor deleted successfully!");
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error("Error deleting advisor:", err);
      alert("Failed to delete advisor.");
    }
  };

  if (loading) return <Spinner />;

  if (error) {
    return (
      <div className="min-h-screen p-4 bg-gray-100 flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-lg font-semibold text-gray-800">
            Config Advisor
          </h1>
          <button
            onClick={() => handleOpenModal()} 
            className="px-4 py-2 bg-red-700 text-white font-medium rounded hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-900"
          >
            Add Advisor
          </button>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                {isEditMode ? "Edit Advisor" : "Add New Advisor"}
              </h2>
              <input
                type="text"
                placeholder="ตำแหน่ง"
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
                className="w-full px-3 py-2 mb-3 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-red-800 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3 py-2 mb-3 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-red-800 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3 py-2 mb-3 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-red-800 focus:border-transparent"
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 mb-3 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-red-800 focus:border-transparent"
              />
              <div className="flex justify-end gap-2">
                {isEditMode && (
                  <button
                    onClick={handleDeleteAdvisor}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                )}
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveAdvisor}
                  className="px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Table Section */}
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-6">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">
                  ID
                </th>
                <th scope="col" className="px-6 py-3">
                  Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Email
                </th>
                <th scope="col" className="px-6 py-3">
                  Number of Projects
                </th>
                <th scope="col" className="px-3 py-3 text-center w-24">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {advisors.map((item) => (
                <tr
                  key={item.id}
                  className="bg-white border-b hover:bg-gray-50"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {item.id}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {item.prefix} {item.first_name} {item.last_name}
                  </td>
                  <td className="px-6 py-4">{item.email}</td>
                  <td className="px-6 py-4">-</td> {/* Blank project count */}
                  <td className="px-3 py-4 text-center">
                    <button
                      onClick={() => handleOpenModal(item)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
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
