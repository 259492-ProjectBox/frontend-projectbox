"use client";

import React, { useEffect, useState } from "react";
import Spinner from "@/components/Spinner";
import { Project } from "@/models/Project";
import getProjectById from "@/app/api/projects/getProjectById";
import Image from "next/image";
import { deobfuscateId} from "@/utils/encodePath";
import Avatar from "@/components/Avatar";
import { getProjectResourceConfig } from "@/app/api/configform/getProjectResourceConfig";
import { ProjectResourceConfig } from "@/models/ProjectResourceConfig";
import { useAuth } from "@/hooks/useAuth";

const ProjectDetailPage = ({ params }: { params: { id: string } }) => {
  const { id } = params; // Get project ID from  the route params
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [resourceConfigs, setResourceConfigs] = useState<ProjectResourceConfig[]>([]);
  const { user } = useAuth();
  
  useEffect(() => {
    const loadProject = async () => {
      try {
        
        const originalId = deobfuscateId(id); // Deobfuscate the ID
        const projectData = await getProjectById(originalId); // Fetch project by ID
        setProject(projectData);
        
        // Fetch resource configs for the program
        if (projectData?.program?.id) {
          const configs = await getProjectResourceConfig(projectData.program.id);
          setResourceConfigs(configs.filter((config: ProjectResourceConfig) => config.is_active));
        }
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
        <h3 className="text-sm font-medium text-gray-700 mb-2">{roleNameTH}</h3>
        <div className="space-y-2">
          {professors.map((professor) => (
            <div key={professor.id} className="flex items-start space-x-2 bg-gray-50 rounded p-2">
              <Avatar
                name={`${professor.firstNameEN} ${professor.lastNameEN}`}
                size="sm"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-900">
                  {professor.prefixTH} {professor.firstNameTH} {professor.lastNameTH}
                </p>
                <p className="text-xs text-gray-500">
                  {professor.prefixEN} {professor.firstNameEN} {professor.lastNameEN}
                </p>
                <p className="text-xs text-gray-400">
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
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
          {/* Project Details Section */}
          <div className="border-b border-gray-100">
            <div className="px-6 py-5">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Project Information</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <span className="text-xs font-medium text-gray-500 block mb-1">Project No</span>
                      <span className="text-sm text-gray-900">{project.projectNo || "No Data"}</span>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-gray-500 block mb-1">Academic Year</span>
                      <span className="text-sm text-gray-900">{project.academicYear || "No Data"}</span>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-gray-500 block mb-1">Major</span>
                      <span className="text-sm text-gray-900">{project.program?.programNameEN || "No Data"}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <span className="text-xs font-medium text-gray-500 block mb-1">Semester</span>
                      <span className="text-sm text-gray-900">{project.semester || "No Data"}</span>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-gray-500 block mb-1">Section</span>
                      <span className="text-sm text-gray-900">{project.sectionId || "No Data"}</span>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-gray-500 block mb-1">Course</span>
                      <span className="text-sm text-gray-900">
                        {project.course?.courseNo || "No Data"} - {project.course?.courseName || "No Data"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="bg-gray-50 rounded p-3">
                    <span className="text-xs font-medium text-gray-500 block mb-1">Project Title (EN)</span>
                    <p className="text-sm text-gray-900">{project.titleEN !== null ? project.titleEN : "No Title"}</p>
                  </div>
                  <div className="bg-gray-50 rounded p-3">
                    <span className="text-xs font-medium text-gray-500 block mb-1">Project Title (TH)</span>
                    <p className="text-sm text-gray-900">{project.titleTH !== null ? project.titleTH : "No Title"}</p>
                  </div>
                  <div className="bg-gray-50 rounded p-3">
                    <span className="text-xs font-medium text-gray-500 block mb-1">Project Description</span>
                    <p className="text-sm text-gray-900 whitespace-pre-line">{project.abstractText || "No Description Available"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Committees Section */}
          <div className="border-b border-gray-100">
            <div className="px-6 py-4">
              <h3 className="text-sm font-semibold text-gray-800 mb-3">Project Committee</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  {renderProfessorsByRole("Advisor", "อาจารย์ที่ปรึกษา")}
                  {renderProfessorsByRole("Co Advisor", "อาจารย์ที่ปรึกษาร่วม")}
                </div>
                <div className="space-y-3">
                  {renderProfessorsByRole("Committee", "กรรมการภายใน")}
                  {renderProfessorsByRole("External Committee", "กรรมการภายนอก")}
                </div>
              </div>
            </div>
          </div>

          {/* Members Section */}
          <div className="border-b border-gray-100">
            <div className="px-6 py-4">
              <h3 className="text-sm font-semibold text-gray-800 mb-3">Team Members</h3>
              {project.members?.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {project.members.map((member) => (
                    <div key={member.id} className="bg-gray-50 rounded p-2">
                      <p className="text-xs font-medium text-gray-900">
                        {member.studentId}
                      </p>
                      <p className="text-xs text-gray-600">
                        {member.firstName} {member.lastName}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500">No members assigned.</p>
              )}
            </div>
          </div>

          {/* Resources Section */}
          {user && (
            <div className="px-6 py-4">
              <h3 className="text-sm font-semibold text-gray-800 mb-3">Project Resources</h3>
              {project.projectResources && project.projectResources.length > 0 ? (
                <div className="space-y-3">
                  {project.projectResources.map((resource) => {
                    // Find matching resource config
                    const matchingConfig = resourceConfigs.find(
                      (config: ProjectResourceConfig) => config.title.toLowerCase() === resource.title?.toLowerCase()
                    );

                    return (
                      <div key={resource.id} className="bg-gray-50 rounded p-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <div className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center">
                              {matchingConfig ? (
                                <div className="w-6 h-6 flex items-center justify-center">
                                  <Image
                                    src={matchingConfig.icon_url}
                                    alt={matchingConfig.icon_name}
                                    width={24}
                                    height={24}
                                    className="object-contain"
                                    unoptimized
                                  />
                                </div>
                              ) : (
                                <div className="w-6 h-6 flex items-center justify-center">
                                  <Image
                                    src="/IconProjectBox/BlueBox.png"
                                    alt="Default Icon"
                                    width={24}
                                    height={24}
                                    className="object-contain"
                                    unoptimized
                                  />
                                </div>
                              )}
                            </div>
                            {resource?.url ? (
                              <a
                                href={resource.url}
                                className="text-sm text-primary-DEFAULT hover:text-primary-dark font-medium block"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {resource.title !== null ? resource.title : "No Title"}
                              </a>
                            ) : (
                              <p className="text-sm font-medium text-gray-900">
                                {resource.title !== null ? resource.title : "No Title"}
                              </p>
                            )}
                          </div>
                          {/* {resource?.path && (
                            <p className="text-xs text-gray-600 ml-11">
                              Path: {resource.path}
                            </p>
                          )} */}
                          {/* {resource?.resourceName && (
                            <p className="text-xs text-gray-600 ml-11">
                              Resource Name: {resource.resourceName}
                            </p>
                          )} */}
                          {resource?.createdAt && (
                            <p className="text-xs text-gray-500 ml-11">
                              Created At: {resource.createdAt}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-gray-500">No resources available.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
