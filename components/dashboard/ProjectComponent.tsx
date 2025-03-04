"use client";
import React from "react";
import { Project } from "@/models/Project"; // Import the Project type
import EditIcon from "@/public/Svg/EditIcon";
import FileIcon from "@/public/Svg/FileIcon";
import YouTubeIcon from "@/public/Svg/YouTubeIcon";
import GitHubIcon from "@/public/Svg/GitHubIcon";
import AutoCADIcon from "@/public/Svg/AutoCADIcon";
import LinkIcon from "@/public/Svg/LinkIcon";
import PictureIcon from "@/public/Svg/PictureIcon";
import PowerPointIcon from "@/public/Svg/PowerPointIcon";
import SketchupIcon from "@/public/Svg/SketchupIcon";
import Link from "next/link";
import { LimitedList, LimitedText } from "@/components/dashboard/LimitedComponents";
import { useAuth } from "@/hooks/useAuth";
import { obfuscateId } from "@/utils/encodePath";

const ProjectComponent = ({ project }: { project: Project }) => {
  const { user } = useAuth();
  const isMember = project.members.some(member => member.studentId === user?.studentId);

  return (
    <div className="relative mb-4 border border-gray-100 rounded-md bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="p-4">
        {/* Edit Button - Top Right */}
        {isMember && (
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

        {/* Icons - Below Project Title */}
        <div className="flex flex-wrap gap-2 mb-3">
          <button className="p-1.5 bg-gray-50 rounded-md hover:bg-gray-100">
            <FileIcon />
          </button>
          <button className="p-1.5 bg-gray-50 rounded-md hover:bg-gray-100">
            <YouTubeIcon />
          </button>
          <button className="p-1.5 bg-gray-50 rounded-md hover:bg-gray-100">
            <GitHubIcon />
          </button>
          <button className="p-1.5 bg-gray-50 rounded-md hover:bg-gray-100">
            <PowerPointIcon />
          </button>
          <button className="p-1.5 bg-gray-50 rounded-md hover:bg-gray-100">
            <PictureIcon />
          </button>
          <button className="p-1.5 bg-gray-50 rounded-md hover:bg-gray-100">
            <AutoCADIcon />
          </button>
          <button className="p-1.5 bg-gray-50 rounded-md hover:bg-gray-100">
            <SketchupIcon />
          </button>
          <button className="p-1.5 bg-gray-50 rounded-md hover:bg-gray-100">
            <LinkIcon />
          </button>
        </div>

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
                    name: `${staff.prefixEN || ""} ${staff.firstNameTH || "No First Name"} ${staff.lastNameTH || "No Last Name"}`,
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
