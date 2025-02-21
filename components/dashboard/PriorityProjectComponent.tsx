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
    <div className="bg-stone-100 min-h-screen p-8">
      <h1 className="text-4xl mb-1">Priority Projects</h1>
      <p className="text-xl text-gray-600">This is a special view for priority users.</p>
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search projects..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        />
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="">All Roles</option>
          {roles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>
      {filteredProjects.length === 0 ? (
        <p>{selectedRole ? "No Project in this roles" : "No projects available"}</p>
      ) : (
        filteredProjects.map((project, index) => (
          <ProjectComponent key={index} project={project} />
        ))
      )}
    </div>
  );
};

export default PriorityProjectComponent;
