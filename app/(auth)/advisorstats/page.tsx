"use client"

import type React from "react"
import { useState, useEffect } from "react"
import getEmployeeByMajorId from "@/utils/advisorstats/getEmployeebyProgramId"
import type { Advisor } from "@/models/Advisor" // Import the Advisor interface
import Spinner from "@/components/Spinner" // Import the Spinner component
import Link from "next/link" // Import Link for navigation
import getAllProgram from "@/utils/getAllProgram"
import type { AllProgram } from "@/models/AllPrograms"
import { getAllEmployeesNew } from "@/utils/advisorstats/getAllEmployee" // Import the getAllEmployees function
import Avatar from "@/components/Avatar"
import Pagination from "@/components/Pagination" // Import Pagination component

export default function AdvisorStatsPage() {
  const [filteredAdvisors, setFilteredAdvisors] = useState<Advisor[]>([]) // Default to empty array
  const [searchTerm, setSearchTerm] = useState<string>("") // Search term state
  const [loading, setLoading] = useState<boolean>(true)
  const [majorList, setMajorList] = useState<AllProgram[]>([]) // Store major list
  const [selectedMajor, setSelectedMajor] = useState<number>(0) // Default to 0 for "Select Major"
  const [currentPage, setCurrentPage] = useState<number>(1) // Current page state
  const itemsPerPage = 10 // Items per page
  const [mapData, setMapData] = useState<Map<string, Advisor[]>>(new Map<string, Advisor[]>())

  useEffect(() => {
    const query = new URLSearchParams(window.location.search)
    const major = query.get("major")
    if (major) {
      setSelectedMajor(Number(major))
    }
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const programData = await getAllProgram() // Fetch all programs
        setMajorList(programData)

        let data: Advisor[]
        if (selectedMajor === -1) {
          const newMap = await getAllEmployeesNew() // Fetch all employees if "All Majors" is selected
          data = Array.from(newMap.values()).flat() // Flatten the map values into an array
          setMapData(newMap)
          setFilteredAdvisors(data) // Initialize filtered data with newMap data
        } else if (selectedMajor === 0) {
          data = []
          setFilteredAdvisors(data) // Initialize filtered data with empty array
        } else {
          data = await getEmployeeByMajorId(selectedMajor) // Fetch employees by major
          setFilteredAdvisors(data) // Initialize filtered data with fetched data

          // Reset search term when changing programs
          setSearchTerm("")
        }
      } catch (error) {
        console.error("Error fetching advisor data: 2", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [selectedMajor]) // Run fetchData when selectedMajor changes

  // Filter advisors based on search term
  useEffect(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase()

    if (selectedMajor === -1 && mapData && mapData.size > 0) {
      // When "All" is selected, filter from mapData
      const filtered = Array.from(mapData.values())
        .flat()
        .filter(
          (advisor) =>
            advisor.first_name_en.toLowerCase().includes(lowerCaseSearchTerm) ||
            advisor.last_name_en.toLowerCase().includes(lowerCaseSearchTerm) ||
            advisor.email.toLowerCase().includes(lowerCaseSearchTerm) ||
            advisor.first_name_th.toLowerCase().includes(lowerCaseSearchTerm) ||
            advisor.last_name_th.toLowerCase().includes(lowerCaseSearchTerm),
        )
      setFilteredAdvisors(filtered)
    } else if (selectedMajor !== 0 && selectedMajor !== -1) {
      // When a specific program is selected, filter from the original data
      getEmployeeByMajorId(selectedMajor).then((data) => {
        const filtered = data.filter(
          (advisor) =>
            advisor.first_name_en.toLowerCase().includes(lowerCaseSearchTerm) ||
            advisor.last_name_en.toLowerCase().includes(lowerCaseSearchTerm) ||
            advisor.email.toLowerCase().includes(lowerCaseSearchTerm) ||
            advisor.first_name_th.toLowerCase().includes(lowerCaseSearchTerm) ||
            advisor.last_name_th.toLowerCase().includes(lowerCaseSearchTerm),
        )
        setFilteredAdvisors(filtered)
      })
    }
  }, [searchTerm, mapData, selectedMajor])

  const handleMajorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMajor(Number(event.target.value)) // Set selected major
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page) // Set current page
    window.scrollTo({ top: 0, behavior: "smooth" }) // Scroll to top
  }

  // Calculate the current page's advisors
  const currentAdvisors = filteredAdvisors
    ? filteredAdvisors.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : []

  return (
    <div className="min-h-screen bg-gray-50/50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h1 className="text-lg font-semibold text-gray-900">Advisor Directory</h1>
            <p className="mt-1 text-sm text-gray-500">Browse and search for advisors across all programs</p>
          </div>

          {/* Controls Section */}
          <div className="p-6 border-b border-gray-100 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:space-x-4">
            {/* Advisor Count */}
            <div className="bg-blue-50 px-4 py-2 rounded-lg">
              <p className="text-sm text-gray-700">
                Total Advisors: <span className="text-blue-600 font-medium">{filteredAdvisors?.length || 0}</span>
              </p>
            </div>

            {/* Major Selector */}
            <div className="flex-1 min-w-[200px]">
              <select
                id="majorSelect"
                value={selectedMajor}
                onChange={handleMajorChange}
                className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg 
                         focus:ring-2 focus:ring-primary-light focus:border-primary-light transition-colors"
              >
                <option value={0}>Select Major</option>
                <option value={-1}>All</option>
                {majorList.map((program) => (
                  <option key={program.id} value={program.id} className="text-wrap w-full ">
                    {"(" + program.abbreviation + ") " + program.program_name_en}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Input */}
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-400"
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
                  className="w-full pl-10 px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg
                           focus:ring-2 focus:ring-primary-light focus:border-primary-light transition-colors"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6">
            {loading ? (
              <div className="flex justify-center py-8">
                <Spinner />
              </div>
            ) : filteredAdvisors?.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">No advisors found.</p>
                <p className="text-gray-400 text-xs mt-1">Try adjusting your search criteria</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  {/* <p>{filteredAdvisors?.length}</p> */}
                  <table className="w-full">
                    {/* count the advisor */}
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Program
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {currentAdvisors.map((advisor) => (
                        <tr key={advisor.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Avatar name={`${advisor.first_name_en} ${advisor.last_name_en}`} size="sm" />
                              <div className="ml-3">
                                <Link href={`/advisorprofile/${advisor.email}`}>
                                  <div className="text-sm font-medium text-primary-DEFAULT hover:text-primary-dark transition-colors">
                                    {advisor.prefix_en} {advisor.first_name_en} {advisor.last_name_en}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {advisor.prefix_th} {advisor.first_name_th} {advisor.last_name_th}
                                  </div>
                                </Link>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{advisor.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {majorList.find((program) => program.id === advisor.program_id)?.abbreviation || "N/A"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-6">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={filteredAdvisors ? Math.ceil(filteredAdvisors.length / itemsPerPage) : 0}
                    onPageChange={handlePageChange}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

