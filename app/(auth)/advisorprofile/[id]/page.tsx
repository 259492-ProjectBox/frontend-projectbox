"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // Import useParams for dynamic routing
import { Project } from "@/models/Project";
import { Advisor } from "@/models/Advisor"; // Assuming this matches the response structure
import Spinner from "@/components/Spinner";
import getProjectsByAdvisorId from "@/utils/advisorstats/getProjectsByAdvisorId";
import getEmployeeById from "@/utils/advisorstats/getAdvisorById";

export default function AdvisorProfilePage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id; // Ensure id is a string
  const [advisor, setAdvisor] = useState<Advisor | null>(null); // State for advisor details
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          // Fetch advisor details
          const advisorData = await getEmployeeById(id);
          setAdvisor(advisorData);

          // Fetch projects associated with the advisor
          const projectData: Project[] = await getProjectsByAdvisorId(id);
          setProjects(projectData);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [id]);

  if (loading) return <Spinner />;

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        {/* Advisor Details Section */}
        <section className="bg-gray-800 text-white p-6">
          <h1 className="text-2xl font-bold">Advisor Profile</h1>
          {advisor ? (
            <div className="mt-4 space-y-2">
              <p className="text-lg font-semibold">
                {advisor.prefix_en} {advisor.first_name_en} {advisor.last_name_en}
                <br />
                {advisor.prefix_th} {advisor.first_name_th} {advisor.last_name_th}
              </p>
              <p className="text-sm">
                <span className="font-medium">Email:</span> {advisor.email}
              </p>
              <p className="text-sm">
                <span className="font-medium">Major ID:</span> {advisor.program_id}
              </p>
            </div>
          ) : (
            <p className="mt-2 text-sm">No advisor details found.</p>
          )}
        </section>

        {/* Advisor Projects Section */}
        <section className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Projects</h2>
          {projects.length > 0 ? (
            <ul className="space-y-6">
              {projects.map((project) => (
                <li
                  key={project.id}
                  className="p-4 bg-gray-100 rounded-lg shadow hover:shadow-md transition-shadow"
                >
                  <h3 className="text-lg font-semibold text-gray-800">
                    {project.title_en || "No Title Available"}
                    <span className="text-sm text-gray-500 ml-2">
                      ({project.project_no})
                    </span>
                  </h3>
                  <p className="text-sm text-gray-600 italic">{project.title_th}</p>
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <p className="text-sm text-gray-600">
                      <strong>Abstract:</strong> {project.abstract_text || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Academic Year:</strong> {project.academic_year}, 
                      <strong> Semester:</strong> {project.semester}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Created At:</strong>{" "}
                      {new Date(project.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No projects found for this advisor.</p>
          )}
        </section>
      </div>
    </div>
  );
}
