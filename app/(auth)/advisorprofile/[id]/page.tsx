"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // Import useParams for dynamic routing
import { Project } from "@/models/Project";
import Spinner from "@/components/Spinner";
import getProjectsByAdvisorId from "@/utils/advisorstats/getProjectsByAdvisorId";

export default function AdvisorProfilePage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id; // Ensure id is a string
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
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
    <div className="min-h-screen p-4 bg-stone-100">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-xl font-bold text-gray-800 mb-4">
          Advisor Projects
        </h1>
        <h2 className="text-lg font-bold text-gray-800 mb-4">Projects</h2>
        {projects.length > 0 ? (
          <ul className="space-y-4">
            {projects.map((project) => (
              <li key={project.id} className="p-4 bg-gray-100 rounded-lg shadow-sm">
                <h3 className="text-base font-semibold text-gray-700">
                  {project.title_en || "No Title Available"} 
                  <span className="text-sm text-gray-500"> ({project.project_no})</span>
                </h3>
                <p className="text-sm text-gray-600 italic">{project.title_th}</p>
                <p className="text-sm text-gray-600 mt-2">
                  <strong>Abstract:</strong> {project.abstract_text || "N/A"}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Academic Year:</strong> {project.academic_year}, 
                  <strong> Semester:</strong> {project.semester}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Approved:</strong> {project.is_approved ? "Yes" : "No"}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Created At:</strong> {new Date(project.created_at).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No projects found for this advisor.</p>
        )}
      </div>
    </div>
  );
}
