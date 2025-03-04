import React, { useState, useEffect } from "react";
import { Project } from "@/models/Project";
import ProjectComponent from "@/components/dashboard/ProjectComponent";

interface PriorityProjectComponentProps {
  projects: Project[];
}

const PriorityProjectComponent: React.FC<PriorityProjectComponentProps> = ({ projects }) => {
  const [searchInput, setSearchInput] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(projects);

  useEffect(() => {
    const filtered = projects.filter((project) => {
      const searchLower = searchInput.toLowerCase();
      return (
        (project.titleEN?.toLowerCase().includes(searchLower) ||
          project.titleTH?.toLowerCase().includes(searchLower) ||
          project.abstractText?.toLowerCase().includes(searchLower) ||
          project.academicYear.toString().includes(searchLower) ||
          project.courseId.toString().includes(searchLower) ||
          project.members.some((member) =>
            `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchLower)
          ) ||
          project.staffs.some((staff) =>
            `${staff.firstNameEN} ${staff.lastNameEN}`.toLowerCase().includes(searchLower)
          )) &&
        (selectedRole === "" || project.staffs.some(staff => staff.projectRole.roleNameEN === selectedRole))
      );
    });
    setFilteredProjects(filtered);
  }, [searchInput, selectedRole, projects]);

  const roles = ["Advisor", "Co Advisor", "Committee", "External Committee"];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-2xl font-medium text-gray-900">Priority Projects</h1>
          <p className="text-sm text-gray-600">Special view for priority users</p>
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
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-gray-400"
              />
            </div>
            <div className="w-full sm:w-40">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-gray-400 bg-white"
              >
                <option value="">All Roles</option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Projects List */}
        <div className="space-y-4">
          {filteredProjects.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-md p-4 text-center shadow-sm">
              <p className="text-sm text-gray-600">
                {selectedRole ? "No projects found for this role" : "No projects available"}
              </p>
            </div>
          ) : (
            filteredProjects.map((project, index) => (
              <ProjectComponent key={index} project={project} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PriorityProjectComponent;
