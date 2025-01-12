"use client";

import React, { useState, useEffect } from "react";
import getEmployeeByMajorId from "@/utils/advisorstats/getEmployeebyMajorId";
import { Advisor } from "@/models/Advisor"; // Import the Advisor interface
import Spinner from "@/components/Spinner"; // Import the Spinner component
import Link from "next/link"; // Import Link for navigation

export default function AdvisorStatsPage() {
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [filteredAdvisors, setFilteredAdvisors] = useState<Advisor[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>(""); // Search term state
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getEmployeeByMajorId(1);
        setAdvisors(data);
        setFilteredAdvisors(data); // Initialize filtered data
      } catch (error) {
        console.error("Error fetching advisor data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter advisors based on search term
  useEffect(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    setFilteredAdvisors(
      advisors.filter(
        (advisor) =>
          advisor.first_name.toLowerCase().includes(lowerCaseSearchTerm) ||
          advisor.last_name.toLowerCase().includes(lowerCaseSearchTerm) ||
          advisor.email.toLowerCase().includes(lowerCaseSearchTerm) 
          // || advisor.program?.toLowerCase().includes(lowerCaseSearchTerm)
      )
    );
  }, [searchTerm, advisors]);

  return (
    <div className="min-h-screen p-4 bg-stone-100">
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg max-w-6xl mx-auto bg-white rounded-lg p-6">
        <h1 className="text-xl font-bold text-gray-800 mb-4">Advisor Stats</h1>
        
        {/* Search Input */}
        <div className="relative mt-1 mb-4">
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

        {loading ? (
          <Spinner /> // Display spinner while loading
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
              {filteredAdvisors.map((advisor) => (
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
              {filteredAdvisors.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    No advisors found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
