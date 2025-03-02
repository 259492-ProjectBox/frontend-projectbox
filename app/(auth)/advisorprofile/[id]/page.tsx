"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation"; // Import useRouter for navigation
import { Project } from "@/models/Project";
import { Advisor } from "@/models/Advisor"; // Assuming this matches the response structure
import Spinner from "@/components/Spinner";
import getProjectsByAdvisorId from "@/utils/advisorstats/getProjectsByAdvisorId";
import getEmployeeById from "@/utils/advisorstats/getAdvisorById";
import ProjectComponent from "@/components/dashboard/ProjectComponent"; // Import ProjectComponent
import Pagination from "@/components/Pagination"; // Import Pagination component
import { getProgramName } from "@/utils/programHelpers";
import { deobfuscateId } from "@/utils/encodePath";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

export default function AdvisorProfilePage() {
  const params = useParams();
  const router = useRouter(); // Initialize useRouter
  const id = params && Array.isArray(params.id) ? params.id[0] : params?.id; // Ensure id is a string
  const [advisor, setAdvisor] = useState<Advisor | null>(null); // State for advisor details
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchInput, setSearchInput] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("");
  const itemsPerPage = 5; // Items per page
  const [currentPage, setCurrentPage] = useState<number>(1); // Current page state
  const [programName, setProgramName] = useState<string | undefined>("");
  const originalId = deobfuscateId(id as string); // Deobfuscate the ID

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
    if (id) {
      const fetchData = async () => {
        try {
          // Fetch advisor details
          const advisorData = await getEmployeeById(originalId.toString());
          setAdvisor(advisorData);
          const programId = advisorData?.program_id;
          const programN = programId ? await getProgramName(programId) : "";
          setProgramName(programN);
          // Fetch projects associated with the advisor
          const projectData: Project[] = await getProjectsByAdvisorId(originalId.toString());
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
  }, [id , originalId]);

  useEffect(() => {
    const filtered = projects.filter((project) => {
      const searchLower = searchInput.toLowerCase();
      console.log("Select role " ,selectedRole)
      console.log("Project staffs", project.staffs);
      console.log("id", originalId);
      
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
          
        (selectedRole === "" || project.staffs.some(staff => staff.projectRole.roleNameEN === selectedRole && staff.id === originalId))
      );
    });
    setFilteredProjects(filtered);
  }, [searchInput, selectedRole, projects ,originalId]);

  if (loading) return <Spinner />;

  const roles = ["Advisor", "Co Advisor", "Committee", "External Committee"];
 return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 ">
      
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        {/* Advisor Details Section */}
        <section className="bg-gray-800 text-white p-6">
          {/* <h1 className="text-2xl font-bold">Advisor Profile</h1> */}
          {advisor ? (
            <div className="space-y-2">
              <div className="flex items-center text-white ">
                <button
                  onClick={handleGoBack}
                  className="text-white rounded flex items-center"
                >
                  <ArrowBackIosNewIcon className="mr-2" />
                </button>
                <p className="text-lg font-semibold ml-4">
                  {advisor.prefix_en} {advisor.first_name_en} {advisor.last_name_en}
                  <br />
                  {advisor.prefix_th} {advisor.first_name_th} {advisor.last_name_th}
                </p>
              </div>
              <p className="text-sm">
                <span className="font-medium">Email:</span> {advisor.email}
              </p>
              <p className="text-sm">
                <span className="font-medium">Major :</span> {programName}
              </p>
            </div>
          ) : (
            <p className="mt-2 text-sm">No advisor details found.</p>
          )}
        </section>

        {/* Advisor Projects Section */}
        <section className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Projects</h2>
            <div className="flex gap-4">
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
          </div>
          {filteredProjects.length > 0 ? (
            <>
              <ul className="space-y-6">
                {currentProjects.map((project) => (
                  <ProjectComponent key={project.id} project={project}  />
                ))}
              </ul>
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(filteredProjects.length / itemsPerPage)}
                onPageChange={handlePageChange}
              />
            </>
          ) : (
            <p className="text-gray-600">No projects found for this advisor.</p>
          )}
        </section>
      </div>
    </div>
  );
}
