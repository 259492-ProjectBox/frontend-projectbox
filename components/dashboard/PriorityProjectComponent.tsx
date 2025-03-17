"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import type { Project } from "@/models/Project"
import ProjectComponent from "@/components/dashboard/ProjectComponent"
import { useAuth } from "@/hooks/useAuth"
import getAdvisorByEmail from "@/app/api/advisorstats/getAdvisorByEmail"
import type { Advisor } from "@/models/Advisor"

interface PriorityProjectComponentProps {
  projects: Project[]
}

const PriorityProjectComponent: React.FC<PriorityProjectComponentProps> = ({ projects }) => {
  const [searchInput, setSearchInput] = useState<string>("")
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]) // Changed to array for multiple selections
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false) // State for dropdown open/close
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(projects)
  const [advisor, setAdvisor] = useState<Advisor | null>(null)
  const { user } = useAuth()
  const dropdownRef = useRef<HTMLDivElement>(null) // Ref for dropdown container

  useEffect(() => {
    const fetchAdvisor = async () => {
      if (user?.cmuAccount) {
        try {
          const advisorData = await getAdvisorByEmail(user.cmuAccount)
          
          setAdvisor(advisorData)
        } catch (error) {
          console.error("Error fetching advisor: 3", error)
        }
      }
    }

    fetchAdvisor()
  }, [user?.cmuAccount])

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

  useEffect(() => {
    const filtered = projects.filter((project) => {
      const searchLower = searchInput.toLowerCase()
      const matchesSearch =
        project.titleEN?.toLowerCase().includes(searchLower) ||
        project.titleTH?.toLowerCase().includes(searchLower) ||
        project.abstractText?.toLowerCase().includes(searchLower) ||
        project.academicYear.toString().includes(searchLower) ||
        project.courseId.toString().includes(searchLower) ||
        project.members.some((member) =>
          `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchLower),
        ) ||
        project.staffs.some((staff) => `${staff.firstNameEN} ${staff.lastNameEN}`.toLowerCase().includes(searchLower))

      // Updated to handle multiple selected roles
      const matchesRole =
        selectedRoles.length === 0 ||
        (advisor &&
          selectedRoles.some((role) =>
            project.staffs.some((staff) => staff.projectRole.roleNameEN === role && staff.id === advisor.id),
          ))

      return matchesSearch && matchesRole
    })
    setFilteredProjects(filtered)
  }, [searchInput, selectedRoles, projects, advisor])

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen)
  }

  const handleRoleChange = (role: string) => {
    setSelectedRoles((prevSelectedRoles) =>
      prevSelectedRoles.includes(role) ? prevSelectedRoles.filter((r) => r !== role) : [...prevSelectedRoles, role],
    )
  }

  const roles = ["Advisor", "Co Advisor", "Committee", "External Committee"]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-2xl font-medium text-gray-900">Priority Projects</h1>
          <p className="text-sm text-gray-600">
            {advisor
              ? `Projects for ${advisor.first_name_en} ${advisor.last_name_en}`
              : "Loading advisor information..."}
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white border border-gray-100 rounded-md shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search projects..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-300"
              />
            </div>
            <div className="relative" ref={dropdownRef}>
              <button
                id="dropdownSearchButton"
                onClick={toggleDropdown}
                className="w-full sm:w-auto inline-flex items-center justify-between px-4 py-2 text-sm font-medium text-center text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-4 focus:outline-none focus:ring-gray-200"
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
                        <label htmlFor={`checkbox-item-${index}`} className="ml-2 text-sm font-medium text-gray-900">
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

        {/* Projects List */}
        <div className="space-y-4">
          {filteredProjects.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-md p-4 text-center shadow-sm">
              <p className="text-sm text-gray-600">
                {selectedRoles.length > 0 ? "No projects found for selected roles" : "No projects available"}
              </p>
            </div>
          ) : (
            filteredProjects.map((project, index) => <ProjectComponent key={index} project={project} />)
          )}
        </div>
      </div>
    </div>
  )
}

export default PriorityProjectComponent

