"use client";

import React, { useState, useEffect } from "react";
import getEmployeeByMajorId from "@/utils/advisorstats/getEmployeebyMajorId";
import { Advisor } from "@/models/Advisor"; // Import the Advisor interface
import Spinner from "@/components/Spinner"; // Import the Spinner component
import Link from "next/link"; // Import Link for navigation

export default function AdvisorStatsPage() {
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getEmployeeByMajorId(1);
        setAdvisors(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching advisor data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen p-4 bg-stone-100">
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg max-w-6xl mx-auto bg-white rounded-lg p-6">
        <h1 className="text-xl font-bold text-gray-800 mb-4">Advisor Stats</h1>
        {loading ? (
          <Spinner /> // Display spinner while loading
        ) : (
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 rounded-lg">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">Prefix</th>
                <th scope="col" className="px-6 py-3">Name</th>
                <th scope="col" className="px-6 py-3">Email</th>
              </tr>
            </thead>
            <tbody>
              {advisors.map((advisor) => (
                <tr key={advisor.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{advisor.prefix}</td>
                  <th
                    scope="row"
                    className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap"
                  >
                    <img
                      className="w-8 h-8 rounded-full"
                      src="https://www.w3schools.com/w3images/avatar2.png"
                      alt={advisor.first_name}
                    />
                    <div className="ps-3">
                      <Link href={`/advisorprofile/${advisor.id}`}>
                        <span className="text-base font-semibold text-red-700 hover:underline cursor-pointer">
                          {advisor.first_name} {advisor.last_name}
                        </span>
                      </Link>
                      <div className="font-normal text-gray-500">{advisor.email}</div>
                    </div>
                  </th>
                  <td className="px-6 py-4">{advisor.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
