"use client";

import React, { useEffect, useState } from "react";
import Spinner from "@/components/Spinner";
import { Project } from "@/models/Project";
import getProjectById from "@/utils/projects/getProjectById";
import Image from "next/image";
import { deobfuscateId} from "@/utils/encodePath";

const ProjectDetailPage = ({ params }: { params: { id: string } }) => {
  const { id } = params; // Get project ID from the route params
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadProject = async () => {
      try {
        
        const originalId = deobfuscateId(id); // Deobfuscate the ID
        const projectData = await getProjectById(originalId); // Fetch project by ID
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
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{roleNameTH}</h3>
        <div className="space-y-4">
          {professors.map((professor) => (
            <div key={professor.id} className="flex items-start space-x-4 bg-gray-50 rounded-lg p-4">
              <div className="w-10 h-10 rounded-full border-2 border-gray-800 flex items-center justify-center bg-white flex-shrink-0">
                <span className="text-gray-800 font-semibold text-sm">
                  {`${professor.firstNameEN?.charAt(0)}${professor.lastNameEN?.charAt(0)}`}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900">
                  {professor.prefixTH} {professor.firstNameTH} {professor.lastNameTH}
                </p>
                <p className="text-sm text-gray-600">
                  {professor.prefixEN} {professor.firstNameEN} {professor.lastNameEN}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {professor.projectRole.roleNameTH}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto max-w-5xl">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Project Details Section */}
          <div className="border-b border-gray-200">
            <div className="px-8 py-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Project Information</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-500">Project No</span>
                      <span className="text-base text-gray-900">{project.projectNo || "No Data"}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-500">Academic Year</span>
                      <span className="text-base text-gray-900">{project.academicYear || "No Data"}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-500">Major</span>
                      <span className="text-base text-gray-900">{project.program?.programNameEN || "No Data"}</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-500">Semester</span>
                      <span className="text-base text-gray-900">{project.semester || "No Data"}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-500">Section</span>
                      <span className="text-base text-gray-900">{project.sectionId || "No Data"}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-500">Course</span>
                      <span className="text-base text-gray-900">
                        {project.course?.courseNo || "No Data"} - {project.course?.courseName || "No Data"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <span className="text-sm font-medium text-gray-500 block mb-2">Project Title (EN)</span>
                    <p className="text-base text-gray-900">{project.titleEN !== null ? project.titleEN : "No Title"}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <span className="text-sm font-medium text-gray-500 block mb-2">Project Title (TH)</span>
                    <p className="text-base text-gray-900">{project.titleTH !== null ? project.titleTH : "No Title"}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <span className="text-sm font-medium text-gray-500 block mb-2">Project Description</span>
                    <p className="text-base text-gray-900 whitespace-pre-line">{project.abstractText || "No Description Available"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Committees Section */}
          <div className="border-b border-gray-200">
            <div className="px-8 py-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Project Committee</h2>
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-6">
                  {renderProfessorsByRole("Advisor", "อาจารย์ที่ปรึกษา")}
                  {renderProfessorsByRole("Co Advisor", "อาจารย์ที่ปรึกษาร่วม")}
                </div>
                <div className="space-y-6">
                  {renderProfessorsByRole("Committee", "กรรมการภายใน")}
                  {renderProfessorsByRole("External Committee", "กรรมการภายนอก")}
                </div>
              </div>
            </div>
          </div>

          {/* Members Section */}
          <div className="border-b border-gray-200">
            <div className="px-8 py-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Team Members</h2>
              {project.members?.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {project.members.map((member) => (
                    <div key={member.id} className="bg-gray-50 rounded-lg p-4">
                      <p className="text-base font-medium text-gray-900">
                        {member.studentId}
                      </p>
                      <p className="text-sm text-gray-600">
                        {member.firstName} {member.lastName}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No members assigned.</p>
              )}
            </div>
          </div>

          {/* Resources Section */}
          <div className="px-8 py-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Project Resources</h2>
            {project.projectResources?.length > 0 ? (
              <div className="space-y-4">
                {project.projectResources.map((resource) => (
                  <div key={resource.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="space-y-2">
                      {resource?.url ? (
                        <a
                          href={resource.url}
                          className="text-blue-600 hover:text-blue-800 font-medium block"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {resource.title !== null ? resource.title : "No Title"}
                        </a>
                      ) : (
                        <p className="font-medium text-gray-900">
                          {resource.title !== null ? resource.title : "No Title"}
                        </p>
                      )}
                      {resource?.path && (
                        <p className="text-sm text-gray-600">
                          Path: {resource.path}
                        </p>
                      )}
                      {resource?.resourceName && (
                        <p className="text-sm text-gray-600">
                          Resource Name: {resource.resourceName}
                        </p>
                      )}
                      {resource?.createdAt && (
                        <p className="text-sm text-gray-600">
                          Created At: {resource.createdAt}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No resources available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
