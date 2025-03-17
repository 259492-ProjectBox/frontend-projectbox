"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation" // Import useRouter for navigation
import type { Project } from "@/models/Project"
import type { Advisor } from "@/models/Advisor" // Assuming this matches the response structure
import Spinner from "@/components/Spinner"
import ProjectComponent from "@/components/dashboard/ProjectComponent" // Import ProjectComponent
import Pagination from "@/components/Pagination" // Import Pagination component
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew"
import Avatar from "@/components/Avatar"
import getAdvisorByEmail from "@/app/api/advisorstats/getAdvisorByEmail"
import getProjectsByAdvisorEmail from "@/app/api/advisorstats/getProjectByAdvisorEmail"

export default function AdvisorProfilePage() {
  const params = useParams()
  const router = useRouter() // Initialize useRouter
  // const id = params && Array.isArray(params.id) ? params.id[0] : params?.id; // Ensure id is a string

  const slug = Array.isArray(params?.slug) ? params?.slug[0] : params?.slug // Ensure slug is a string
  const email = slug as string
  const [advisor, setAdvisor] = useState<Advisor | null>(null) // State for advisor details
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [searchInput, setSearchInput] = useState<string>("")
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]) // State for selected roles
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false) // State for dropdown open/close
  const itemsPerPage = 5 // Items per page
  const [currentPage, setCurrentPage] = useState<number>(1) // Current page state
  const dropdownRef = useRef<HTMLDivElement>(null) // Ref for dropdown container

  const handlePageChange = (page: number) => {
    setCurrentPage(page) // Set current page
    window.scrollTo({ top: 0, behavior: "smooth" }) // Scroll to top
  }

  const handleGoBack = () => {
    router.push(`/advisorstats?major=${advisor?.program_id}`) // Navigate back with query parameter
  }

  const handleRoleChange = (role: string) => {
    setSelectedRoles((prevSelectedRoles) =>
      prevSelectedRoles.includes(role) ? prevSelectedRoles.filter((r) => r !== role) : [...prevSelectedRoles, role],
    )
  }

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen)
  }

  // Handle clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }

    // Add event listener when dropdown is open
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    // Clean up event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [dropdownOpen])

  // Calculate the current page's projects
  const currentProjects = filteredProjects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  useEffect(() => {
    if (email) {
      const fetchData = async () => {
        try {
          // Fetch advisor details
          const advisorData = await getAdvisorByEmail(email)
          setAdvisor(advisorData)
          const projectData: Project[] = await getProjectsByAdvisorEmail(email)
          setProjects(projectData)
          setFilteredProjects(projectData)
        } catch (error) {
          console.error("Error fetching data:", error)
        } finally {
          setLoading(false)
        }
      }
      fetchData()
    }
  }, [email])

  useEffect(() => {
    const filtered = projects.filter((project) => {
      const searchLower = searchInput.toLowerCase()

      return (
        (project.titleEN?.toLowerCase().includes(searchLower) ||
          project.titleTH?.toLowerCase().includes(searchLower) ||
          project.abstractText?.toLowerCase().includes(searchLower) ||
          project.academicYear.toString().includes(searchLower) ||
          project.courseId.toString().includes(searchLower) ||
          project.members.some((member) =>
            `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchLower),
          ) ||
          project.staffs.some((staff) =>
            `${staff.firstNameEN} ${staff.lastNameEN}`.toLowerCase().includes(searchLower),
          )) &&
        (selectedRoles.length === 0 ||
          selectedRoles.some((role) =>
            project.staffs.some((staff) => staff.projectRole.roleNameEN === role && staff.id === advisor?.id),
          ))
      )
    })
    setFilteredProjects(filtered)
  }, [searchInput, selectedRoles, projects, email])

  if (loading) return <Spinner />

  const roles = ["Advisor", "Co Advisor", "Committee", "External Committee"]
  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
          {/* Advisor Details Section */}
          <div className="border-b border-gray-100">
            <div className="px-6 py-4">
              <div className="flex items-center space-x-4">
                <button onClick={handleGoBack} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <ArrowBackIosNewIcon className="w-4 h-4" />
                </button>
                <div className="flex items-center space-x-3">
                  <Avatar name={`${advisor?.first_name_en} ${advisor?.last_name_en}`} size="md" />
                  <div>
                    <h1 className="text-base font-medium text-gray-900">
                      {advisor?.prefix_en} {advisor?.first_name_en} {advisor?.last_name_en}
                    </h1>
                    <p className="text-sm text-gray-500">
                      {advisor?.prefix_th} {advisor?.first_name_th} {advisor?.last_name_th}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Email:</span> {advisor?.email}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-4 space-y-1"></div>
            </div>
          </div>

          {/* Projects Section */}
          <div className="px-6 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <h2 className="text-sm font-semibold text-gray-800">Projects</h2>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-300"
                />
                <div className="relative" ref={dropdownRef}>
                  <button
                    id="dropdownSearchButton"
                    onClick={toggleDropdown}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-4 focus:outline-none focus:ring-gray-200"
                    type="button"
                  >
                    Filter Roles
                    <svg
                      className="w-2.5 h-2.5 ms-2.5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 10 6"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 4 4 4-4"
                      />
                    </svg>
                  </button>
                  {dropdownOpen && (
                    <div
                      id="dropdownSearch"
                      className="absolute z-10 bg-white rounded-lg shadow-lg w-60 border border-gray-200 mt-1 right-0"
                    >
                      <div className="p-3 space-y-2">
                        {roles.map((role, index) => (
                          <div key={index} className="flex items-center">
                            <input
                              id={`checkbox-item-${index}`}
                              type="checkbox"
                              value={role}
                              checked={selectedRoles.includes(role)}
                              onChange={() => handleRoleChange(role)}
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label
                              htmlFor={`checkbox-item-${index}`}
                              className="ml-2 text-sm font-medium text-gray-900"
                            >
                              {role}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {filteredProjects.length > 0 ? (
              <>
                <div className="space-y-3">
                  {currentProjects.map((project) => (
                    <ProjectComponent key={project.id} project={project} />
                  ))}
                </div>
                <div className="mt-4 border-t border-gray-100 pt-4">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(filteredProjects.length / itemsPerPage)}
                    onPageChange={handlePageChange}
                  />
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-gray-500">No projects found.</p>
                <p className="text-xs text-gray-400 mt-1">Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

