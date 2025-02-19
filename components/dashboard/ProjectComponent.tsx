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

const ProjectComponent = ({ project }: { project: Project }) => {
  const { user } = useAuth();
  const isMember = project.members.some(member => member.studentId === user?.studentId);

  return (
    <div className="relative mb-6 border border-gray-200 rounded-lg shadow-sm bg-white">
      <div className="p-4">
        {/* Edit Button - Top Right */}
        {isMember && (
          <Link href={`/editproject/${project.id}`}>
            <div
              className="absolute top-4 right-4 p-2 rounded-full bg-blue-100 hover:bg-blue-200"
              aria-label="Edit Project"
            >
              <EditIcon />
            </div>
          </Link>
        )}

        {/* Project Title */}
        <div>
          <h3 className="text-sm font-semibold text-black">
            Project No: {project.projectNo || "No Data"}
          </h3>
          <h4 className="text-xl font-bold text-primary_text hover:underline cursor-pointer mb-2">
            <Link href={`/projectdetail/${project.id}`}>
              {project.titleTH || "No Title"} — {project.titleEN || "No Title"}
            </Link>
          </h4>
        </div>

        {/* Icons - Below Project Title */}
        <div className="flex flex-wrap gap-4 mb-4">
          <button className="p-2 bg-stone-100 rounded hover:bg-stone-200">
            <FileIcon />
          </button>
          <button className="p-2 bg-stone-100 rounded hover:bg-stone-200">
            <YouTubeIcon />
          </button>
          <button className="p-2 bg-stone-100 rounded hover:bg-stone-200">
            <GitHubIcon />
          </button>
          <button className="p-2 bg-stone-100 rounded hover:bg-stone-200">
            <PowerPointIcon />
          </button>
          <button className="p-2 bg-stone-100 rounded hover:bg-stone-200">
            <PictureIcon />
          </button>
          <button className="p-2 bg-stone-100 rounded hover:bg-stone-200">
            <AutoCADIcon />
          </button>
          <button className="p-2 bg-stone-100 rounded hover:bg-stone-200">
            <SketchupIcon />
          </button>
          <button className="p-2 bg-stone-100 rounded hover:bg-stone-200">
            <LinkIcon />
          </button>
        </div>

        {/* Students and Committees */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <LimitedList
            items={project.members.map((member) => ({
              name: `${member.firstName} ${member.lastName}`,
              id: member.studentId,
            }))}
            title="Members"
          />
          {project.staffs.some((staff) => ["Advisor", "Co Advisor", "Committee", "External Committee"].includes(staff.projectRole.roleNameEN)) && (
            <LimitedList
              items={project.staffs
                .filter((staff) => ["Advisor", "Co Advisor", "Committee", "External Committee"].includes(staff.projectRole.roleNameEN))
                .map((staff) => ({
                  name: `${staff.prefixEN || ""} ${staff.firstNameTH || "No First Name"} ${staff.lastNameTH || "No Last Name"}`,
                  role: staff.projectRole.roleNameEN,
                }))}
              title="Professor"
            />
          )}
        </div>

        {/* Project Description */}
        <div className="w-full">
          <LimitedText text={project.abstractText || "No Description"} />
        </div>
      </div>
    </div>
  );
};

export default ProjectComponent;
