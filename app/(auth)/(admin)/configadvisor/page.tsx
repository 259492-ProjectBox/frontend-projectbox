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

  const handleCreateAdvisor = async () => {
    try {
      const newAdvisorPayload = {
        prefix,
        first_name: firstName,
        last_name: lastName,
        email,
        major_id: 1, // Hardcoded major_id as an example
      };

      // Use the imported postCreateAdvisor function
      const newAdvisor = await postCreateAdvisor(newAdvisorPayload);

      // Add the new advisor to the list
      setAdvisors((prev) => [...prev, newAdvisor]);

      // Clear form inputs
      setPrefix("");
      setFirstName("");
      setLastName("");
      setEmail("");

      alert("Advisor created successfully!");
    } catch (err) {
      console.error("Error creating advisor:", err);
      alert("Failed to create advisor.");
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
        <h1 className="text-lg font-semibold text-gray-800 mb-3">Config Advisor</h1>

        {/* Form Section */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <input
            type="text"
            placeholder="Prefix"
            value={prefix}
            onChange={(e) => setPrefix(e.target.value)}
            className="col-span-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-800 focus:border-transparent text-sm"
          />
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="col-span-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-800 focus:border-transparent text-sm"
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="col-span-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-800 focus:border-transparent text-sm"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="col-span-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-800 focus:border-transparent text-sm"
          />
          <button
            onClick={handleCreateAdvisor}
            className="col-span-4 px-4 py-1 bg-red-700 text-white font-medium rounded hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-900 text-sm"
          >
            Add Advisor
          </button>
        </div>

        {/* Table Section */}
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">ID</th>
                <th scope="col" className="px-6 py-3">Name</th>
                <th scope="col" className="px-6 py-3">Email</th>
                <th scope="col" className="px-6 py-3">Number of Projects</th>
                <th scope="col" className="px-3 py-3 text-center w-24">Action</th>
              </tr>
            </thead>
            <tbody>
              {advisors.map((item) => (
                <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{item.id}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {item.prefix} {item.first_name} {item.last_name}
                  </td>
                  <td className="px-6 py-4">{item.email}</td>
                  <td className="px-6 py-4">-</td> {/* Blank project count */}
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
