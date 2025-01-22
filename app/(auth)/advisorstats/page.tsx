"use client";

import React, { useState, useEffect } from "react";
import getEmployeeByMajorId from "@/utils/advisorstats/getEmployeebyProgramId";
import { Advisor } from "@/models/Advisor"; // Import the Advisor interface
import Spinner from "@/components/Spinner"; // Import the Spinner component
import Link from "next/link"; // Import Link for navigation
import getAllProgram from "@/utils/getAllProgram";
import { AllProgram } from "@/models/AllPrograms";

export default function AdvisorStatsPage() {
  const [advisors, setAdvisors] = useState<Advisor[]>([]); // Default to empty array
  const [filteredAdvisors, setFilteredAdvisors] = useState<Advisor[]>([]); // Default to empty array
  const [searchTerm, setSearchTerm] = useState<string>(""); // Search term state
  const [loading, setLoading] = useState<boolean>(true);
  const [majorList, setMajorList] = useState<AllProgram[]>([]); // Store major list
  const [selectedMajor, setSelectedMajor] = useState<number | null>(null); // Selected major id state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const programData = await getAllProgram(); // Fetch all programs
        setMajorList(programData);

        const data = await getEmployeeByMajorId(selectedMajor || 2); // Default to major id 1 if not selected
        setAdvisors(data);
        setFilteredAdvisors(data); // Initialize filtered data
      } catch (error) {
        console.error("Error fetching advisor data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedMajor]); // Run fetchData when selectedMajor changes

// Filter advisors based on search term
useEffect(() => {
  if (advisors && advisors.length > 0) {  // Make sure advisors is not null and has data
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    setFilteredAdvisors(
      advisors.filter(
        (advisor) =>
          advisor.first_name.toLowerCase().includes(lowerCaseSearchTerm) ||
          advisor.last_name.toLowerCase().includes(lowerCaseSearchTerm) ||
          advisor.email.toLowerCase().includes(lowerCaseSearchTerm)
      )
    );
  }
}, [searchTerm, advisors]);


  const handleMajorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMajor(Number(event.target.value));
  };

  return (
    <div className="min-h-screen p-4 bg-stone-100">
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg max-w-6xl mx-auto bg-white rounded-lg p-6">
        <h1 className="text-xl font-bold text-gray-800 mb-4">Advisor Stats</h1>

        {/* Flexbox for Select Major and Search Input */}
        <div className="flex items-center space-x-4 mb-4">
          {/* Major Selector */}
          <select
            id="majorSelect"
            value={selectedMajor ?? ""}
            onChange={handleMajorChange}
            className="block w-40 p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Majors</option>
            {majorList.map((program) => (
              <option key={program.id} value={program.id}>
                {program.program_name_en}
              </option>
            ))}
          </select>

          {/* Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="text"
              className="block w-80 pl-10 p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search for advisors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <Spinner /> // Display spinner while loading
        ) : filteredAdvisors?.length === 0 ? (
          <div className="text-center text-gray-500">No advisors found.</div>
        ) : (
          <table className="w-full text-sm text-left text-gray-500 rounded-lg">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">Name</th>
                <th scope="col" className="px-6 py-3">Email</th>
                <th scope="col" className="px-6 py-3">Program</th>
                <th scope="col" className="px-6 py-3">Count</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdvisors?.map((advisor) => (
                <tr key={advisor.id} className="bg-white border-b hover:bg-gray-50">
                  <th
                    scope="row"
                    className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap"
                  >
                    <img
                      className="w-8 h-8 rounded-full"
                      src="https://www.w3schools.com/w3images/avatar2.png"
                      alt={advisor.first_name}
                    />
                    <div className="pl-3">
                      <Link href={`/advisorprofile/${advisor.id}`}>
                        <span className="text-base font-semibold text-red-700 hover:underline cursor-pointer">
                          {advisor.prefix} {advisor.first_name} {advisor.last_name}
                        </span>
                      </Link>
                    </div>
                  </th>
                  <td className="px-6 py-4">{advisor.email}</td>
                  {/* <td className="px-6 py-4">{advisor.count ?? "N/A"}</td> 
                  <td className="px-6 py-4">{advisor.program ?? "N/A"}</td>  */}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
