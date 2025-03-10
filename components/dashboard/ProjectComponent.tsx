"use client";
import React, { useEffect, useState } from "react";
import { Project } from "@/models/Project"; // Import the Project type
import EditIcon from "@/public/Svg/EditIcon";
import Image from "next/image";
import Link from "next/link";
import { LimitedList, LimitedText } from "@/components/dashboard/LimitedComponents";
import { useAuth } from "@/hooks/useAuth";
import { obfuscateId } from "@/utils/encodePath";
import { getProjectResourceConfig } from "@/utils/configform/getProjectResourceConfig";
import { ProjectResourceConfig } from "@/models/ProjectResourceConfig";

const ProjectComponent = ({ project }: { project: Project }) => {
  const { user } = useAuth();
  const [resourceConfigs, setResourceConfigs] = useState<ProjectResourceConfig[]>([]);
  const isMember = project.members.some(member => member.studentId === user?.studentId);
  const isProjectProgramAdmin = user?.isAdmin?.includes(project.programId);

  useEffect(() => {
    const loadResourceConfigs = async () => {
      if (project.program.id) {
        try {
          const configs = await getProjectResourceConfig(project.program.id);
          if (configs) {
            setResourceConfigs(configs);
          } else {
            setResourceConfigs([]);
            // console.warn("No resource configs found for program:", project.program.id);
          }
        } catch (error) {
          console.error("Error loading resource configs:", error);
          setResourceConfigs([]);
        }
      }
    };

    loadResourceConfigs();
  }, [project.program?.id]);

  return (
    <div className="relative mb-4 border border-gray-100 rounded-md bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="p-4">
        {/* Edit Button - Top Right */}
        {(isMember || isProjectProgramAdmin) && (
          <Link href={`/editproject/${project.id}`}>
            <div
              className="absolute top-3 right-3 p-1.5 rounded-full bg-gray-50 hover:bg-gray-100"
              aria-label="Edit Project"
            >
              <EditIcon />
            </div>
          </Link>
        )}

        {/* Project Title */}
        <div className="mb-3">
          <h3 className="text-xs text-gray-500">
            Project No: {project.projectNo || "No Data"}
          </h3>
          <h4 className="text-base font-medium text-gray-900 hover:text-blue-600">
            <Link href={`/projectdetail/${obfuscateId(project.id)}`}>
              {project.titleTH || "No Title"} — {project.titleEN || "No Title"}
            </Link>
          </h4>
        </div>

        {/* Resource Icons */}
        {user && project.projectResources?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {project.projectResources?.map((resource) => {
              // Find matching resource config
              const matchingConfig = resourceConfigs.find(
                (config) => config.title.toLowerCase() === resource.title?.toLowerCase()
              );

              return (
                <div key={resource.id} className="relative group">
                  {resource.url ? (
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-1.5 bg-gray-50 rounded-md hover:bg-gray-100"
                    >
                      <div className="w-6 h-6 flex items-center justify-center">
                        {matchingConfig ? (
                          <Image
                            src={matchingConfig.icon_url}
                            alt={matchingConfig.title}
                            width={24}
                            height={24}
                            className="object-contain"
                            unoptimized
                          />
                        ) : (
                          <Image
                            src="/IconProjectBox/BlueBox.png"
                            alt="Default Icon"
                            width={24}
                            height={24}
                            className="object-contain"
                            unoptimized
                          />
                        )}
                      </div>
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                        {resource.title || "No Title"}
                      </div>
                    </a>
                  ) : (
                    <div className="p-1.5 bg-gray-50 rounded-md">
                      <div className="w-6 h-6 flex items-center justify-center">
                        {matchingConfig ? (
                          <Image
                            src={matchingConfig.icon_url}
                            alt={matchingConfig.title}
                            width={24}
                            height={24}
                            className="object-contain"
                            unoptimized
                          />
                        ) : (
                          <Image
                            src="/IconProjectBox/BlueBox.png"
                            alt="Default Icon"
                            width={24}
                            height={24}
                            className="object-contain"
                            unoptimized
                          />
                        )}
                      </div>
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                        {resource.title || "No Title"}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Students and Committees */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
          <div className="bg-gray-50 p-3 rounded-md">
            <LimitedList
              items={project.members.map((member) => ({
                name: `${member.firstName} ${member.lastName}`,
                id: member.studentId,
              }))}
              title="Members"
            />
          </div>
          {project.staffs.some((staff) => ["Advisor", "Co Advisor", "Committee", "External Committee"].includes(staff.projectRole.roleNameEN)) && (
            <div className="bg-gray-50 p-3 rounded-md">
              <LimitedList
                items={project.staffs
                  .filter((staff) => ["Advisor", "Co Advisor", "Committee", "External Committee"].includes(staff.projectRole.roleNameEN))
                  .map((staff) => ({
                    name: `${staff.prefixEN || ""} ${staff.firstNameTH || "No First Name"} ${staff.lastNameTH || "No Last Name"} / ${staff.firstNameEN || "No First Name"} ${staff.lastNameEN || "No Last Name"}`,
                    role: staff.projectRole.roleNameEN,
                  }))}
                title="Professor"
              />
            </div>
          )}
        </div>

        {/* Project Description */}
        <div className="w-full bg-gray-50 p-3 rounded-md">
          <LimitedText text={project.abstractText || "No Description"} />
        </div>
      </div>
    </div>
  );
};

export default ProjectComponent;
