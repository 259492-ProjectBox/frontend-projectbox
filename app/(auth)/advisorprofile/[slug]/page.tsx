"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation"; // Import useRouter for navigation
import { Project } from "@/models/Project";
import { Advisor } from "@/models/Advisor"; // Assuming this matches the response structure
import Spinner from "@/components/Spinner";
import ProjectComponent from "@/components/dashboard/ProjectComponent"; // Import ProjectComponent
import Pagination from "@/components/Pagination"; // Import Pagination component
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import Avatar from "@/components/Avatar";
import getAdvisorByEmail from "@/utils/advisorstats/getAdvisorByEmail";
import getProjectsByAdvisorEmail from "@/utils/advisorstats/getProjectByAdvisorEmail";

export default function AdvisorProfilePage() {
  const params = useParams();
  const router = useRouter(); // Initialize useRouter
  // const id = params && Array.isArray(params.id) ? params.id[0] : params?.id; // Ensure id is a string
  const slug = Array.isArray(params?.slug) ? params?.slug[0] : params?.slug; // Ensure slug is a string
  const email = slug as string
  const [advisor, setAdvisor] = useState<Advisor | null>(null); // State for advisor details
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchInput, setSearchInput] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("");
  const itemsPerPage = 5; // Items per page
  const [currentPage, setCurrentPage] = useState<number>(1); // Current page state
  // const originalId = deobfuscateId(email as string).toString(); // Deobfuscate the ID
  // const originalId = deobfuscateId(id as string); // Deobfuscate the ID
  console.log("Project", projects);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page); // Set current page
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top
  };

  const handleGoBack = () => {
    router.push(`/advisorstats?major=${advisor?.program_id}`); // Navigate back with query parameter
  };

  // Calculate the current page's projects
  const currentProjects = filteredProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    if (email) {
      const fetchData = async () => {
        try {
          // Fetch advisor details
          const advisorData = await getAdvisorByEmail(email );
          setAdvisor(advisorData);
          const projectData: Project[] = await getProjectsByAdvisorEmail(email );
          setProjects(projectData);
          setFilteredProjects(projectData);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [email]);

  useEffect(() => {
    const filtered = projects.filter((project) => {
      const searchLower = searchInput.toLowerCase();
      // console.log("Select role " ,selectedRole)
      // console.log("Project staffs", project.staffs);
      console.log("selectedRole", selectedRole,email);
      
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
          
        (selectedRole === "" || project.staffs.some(staff => staff.projectRole.roleNameEN === selectedRole && staff.id === advisor?.id))
      );
    });
    setFilteredProjects(filtered);
  }, [searchInput, selectedRole, projects ,email]);

  if (loading) return <Spinner />;

  const roles = ["Advisor", "Co Advisor", "Committee", "External Committee"];
 return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
          {/* Advisor Details Section */}
          <div className="border-b border-gray-100">
            <div className="px-6 py-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleGoBack}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <ArrowBackIosNewIcon className="w-4 h-4" />
                </button>
                <div className="flex items-center space-x-3">
                  <Avatar
                    name={`${advisor?.first_name_en} ${advisor?.last_name_en}`}
                    size="md"
                  />
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
              <div className="mt-4 space-y-1">
              </div>
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
                  className="px-3 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-primary-light"
                />
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="px-3 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-primary-light bg-white"
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
  );
}
