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

  const renderProfessorsByRole = (roleNameEN: string, roleNameTH: string) => {
    const professors = project.staffs.filter(
      (staff) => staff.projectRole.roleNameEN === roleNameEN
    );

    if (professors.length === 0) return null;

    return (
      <div className="pb-6">
        <h2 className="text-m font-bold text-gray-800 mb-4">{roleNameTH}</h2>
        <ul className="space-y-4">
          {professors.map((professor) => (
            <li key={professor.id} className="flex items-center space-x-4">
              <Image
                className="w-8 h-8 rounded-full"
                src="/logo-engcmu/CMU_LOGO_Crop.jpg"
                alt={professor.firstNameTH || "Professor"}
                width={32} // Specify width (in px)
                height={32} // Specify height (in px)
              />
              <div>
                <p className="font-semibold text-gray-800">
                  {professor.prefixTH} {professor.firstNameTH} {professor.lastNameTH}
                </p>
                <p className="text-gray-500 text-sm">
                  {professor.projectRole.roleNameTH}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-stone-100 py-6">
      <div className="container mx-auto max-w-4xl bg-white p-6 shadow-md rounded-lg space-y-12">
        {/* Project Details Section */}
        <div className="border-b pb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Project Details
          </h2>
          <div className="space-y-4 p-6">
            <div className="grid grid-cols-2 gap-4">
              <p>
                <strong className="text-gray-700">Project No:</strong>{" "}
                {project.projectNo || "No Data"}
              </p>
              <p>
                <strong className="text-gray-700">Academic Year:</strong>{" "}
                {project.academicYear || "No Data"}
              </p>
              <p>
                <strong className="text-gray-700">Semester:</strong>{" "}
                {project.semester || "No Data"}
              </p>
              {project.sectionId && (
                <p>
                  <strong className="text-gray-700">Section:</strong>{" "}
                  {project.sectionId}
                </p>
              )}
              <p>
                <strong className="text-gray-700">Major:</strong>{" "}
                {project.program?.programNameEN || "No Data"}
              </p>
              <p>
                <strong className="text-gray-700">Course:</strong>{" "}
                {project.course?.courseNo || "No Data"} -{" "}
                {project.course?.courseName || "No Data"}
              </p>
            </div>
            <div className="p-4 border rounded-md">
              <p>
                <strong className="text-gray-700">Project Title (EN):</strong>{" "}
                {project.titleEN !== null ? project.titleEN : "No Title"}
              </p>
            </div>
            <div className="p-4 border rounded-md">
              <p>
                <strong className="text-gray-700">Project Title (TH):</strong>{" "}
                {project.titleTH !== null ? project.titleTH : "No Title"}
              </p>
            </div>
            <div className="p-4 border rounded-md">
              <p className="space-y-2">
                <strong className="text-gray-700">Project Description:</strong>{" "}
                {project.abstractText || "No Description Available"}
              </p>
            </div>
          </div>
        </div>

        {/* Professors Section */}
        <div className="border-b pb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Professors</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              {renderProfessorsByRole("Advisor", "Advisor")}
              {renderProfessorsByRole("Co Advisor", "Co Advisor")}
            </div>
            <div>
              {renderProfessorsByRole("Committee", "Committee")}
              {renderProfessorsByRole("External Committee", "External Committee")}
            </div>
          </div>
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
                    src="/icon/boy.png"
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
          <p className="text-gray-500">Below are the resources related to this project:</p>
          {project.projectResources?.length > 0 ? (
            <ul className="space-y-4">
              {project.projectResources.map((resource) => (
                <li key={resource.id} className="flex items-start space-x-4">
                  <div style={{ wordBreak: 'break-all' }}>
                    {resource?.url && (
                      <a
                        href={resource.url}
                        className="font-semibold text-blue-500 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {resource.title !== null ? resource.title : "No Title"}
                      </a>
                    )}
                    {!resource?.url && (
                      <p className="font-semibold text-gray-800">
                        {resource.title !== null ? resource.title : "No Title"}
                      </p>
                    )}
                    {resource?.path && (
                      <p className="text-gray-500 text-sm break-all">
                        Path: {resource.path}
                      </p>
                    )}
                    {resource?.resourceName && (
                      <p className="text-gray-500 text-sm">
                        Resource Name: {resource.resourceName}
                      </p>
                    )}
                    {resource?.createdAt && (
                      <p className="text-gray-500 text-sm">
                        Created At: {resource.createdAt}
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
