"use client";

import React, { useEffect, useState } from "react";
import Spinner from "@/components/Spinner";
import { Project } from "@/models/Project";
import getProjectById from "@/utils/projects/getProjectById";
import Image from "next/image";

const ProjectDetailPage = ({ params }: { params: { id: string } }) => {
  const { id } = params; // Get project ID from the route params
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProject = async () => {
      try {
        const projectData = await getProjectById(parseInt(id)); // Fetch project by ID
        setProject(projectData);
      } catch (error) {
        console.error("Error fetching project details:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [id]);

  if (loading) return <Spinner />;
  if (!project) return <p>No project found.</p>;

  return (
    <div className="flex flex-col min-h-screen bg-stone-100 py-6">
      <div className="container mx-auto max-w-4xl bg-white p-6 shadow-md rounded-lg space-y-12">
        {/* Project Details Section */}
        <div className="border-b pb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Project Details
          </h2>
          <div className="space-y-2">
            <p>
              <strong className="text-gray-700">Project No:</strong>{" "}
              {project.projectNo || "No Data"}
            </p>
            <p>
              <strong className="text-gray-700">Academic Year:</strong>{" "}
              {project.academic_year || "No Data"}
            </p>
            <p>
              <strong className="text-gray-700">Semester:</strong>{" "}
              {project.semester || "No Data"}
            </p>
            {project.section_id && (
              <p>
                <strong className="text-gray-700">Section:</strong>{" "}
                {project.section_id}
              </p>
            )}
            <p>
              <strong className="text-gray-700">Major:</strong>{" "}
              {project.program?.program_name_en || "No Data"}
            </p>
            <p>
              <strong className="text-gray-700">Course:</strong>{" "}
              {project.course?.course_no || "No Data"} -{" "}
              {project.course?.course_name || "No Data"}
            </p>
            <p>
              <strong className="text-gray-700">Project Title (EN):</strong>{" "}
              {project.titleEN || "No Title"}
            </p>
            <p>
              <strong className="text-gray-700">Project Title (TH):</strong>{" "}
              {project.titleTH || "No Title"}
            </p>
            <p>
              <strong className="text-gray-700">Project Description:</strong>{" "}
              {project.abstractText || "No Description Available"}
            </p>
          </div>
        </div>

        {/* Advisor Section */}
        <div className="border-b pb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Advisor</h2>
          {project.staffs?.length > 0 ? (
            <ul className="space-y-4">
              {project.staffs.map((advisor) => (
                <li key={advisor.id} className="flex items-center space-x-4">
                  <Image
                    className="w-8 h-8 rounded-full"
                    src="/logo-engcmu/CMU_LOGO_Crop.jpg"
                    alt={advisor.firstName || "Advisor"}
                    width={32} // Specify width (in px)
                    height={32} // Specify height (in px)
                  />
                  <div>
                    <p className="font-semibold text-gray-800">
                      {advisor.prefix} {advisor.firstName} {advisor.lastName}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {advisor.projectRole.roleName}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No advisor assigned.</p>
          )}
        </div>

        {/* Members Section */}
        <div className="pb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Members</h2>
          {project.members?.length > 0 ? (
            <ul className="space-y-4">
              {project.members.map((member) => (
                <li key={member.id} className="flex items-center space-x-4">
                  <Image
                    className="w-8 h-8 rounded-full"
                    src="/logo-engcmu/CMU_LOGO_Crop.jpg"
                    alt={""}
                    width={32} // Specify width (in px)
                    height={32} // Specify height (in px)
                  />

                  <div>
                    <p className="font-semibold text-gray-800">
                      {member.studentId} - {member.firstName} {member.lastName}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No members assigned.</p>
          )}
        </div>

        {/* Project Resources Section */}
        <div className="pb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Resources</h2>
          {project.project_resources?.length > 0 ? (
            <ul className="space-y-4">
              {project.project_resources.map((resource) => (
                <li key={resource.id} className="flex items-center space-x-4">
                  <div>
                    <p className="font-semibold text-gray-800">
                      {resource.resource.title || "No Title"}
                    </p>
                    {resource.resource.url && (
                      <a
                        href={resource.resource.url}
                        className="text-blue-500"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {resource.resource.url}
                      </a>
                    )}
                    {resource.resource.path && (
                      <p className="text-gray-500 text-sm">
                        Path: {resource.resource.path}
                      </p>
                    )}
                    {resource.resource.resource_name && (
                      <p className="text-gray-500 text-sm">
                        Resource Name: {resource.resource.resource_name}
                      </p>
                    )}
                    {resource.resource.created_at && (
                      <p className="text-gray-500 text-sm">
                        Created At: {resource.resource.created_at}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No resources available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
