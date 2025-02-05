"use client";
import React, { useEffect, useState } from "react";
import getProjectByStudentId from "@/utils/dashboard/getProjectByStudentId";
import { Project } from "@/models/Project";
import Spinner from "@/components/Spinner";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@/public/Svg/EditIcon";
import FileIcon from "@/public/Svg/FileIcon";
import YouTubeIcon from "@/public/Svg/YouTubeIcon";
import GitHubIcon from "@/public/Svg/GitHubIcon";
import AutoCADIcon from "@/public/Svg/AutoCADIcon";
import LinkIcon from "@/public/Svg/LinkIcon";
import PictureIcon from "@/public/Svg/PictureIcon";
import PowerPointIcon from "@/public/Svg/PowerPointIcon";
import SketchupIcon from "@/public/Svg/SketchupIcon";
import { CustomTooltip } from "@/components/CustomTooltip";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { createProjectCheckPermission } from "@/utils/dashboard/createProjectCheckPermission"; // Import the new utility function

function Dashboard() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]); // Ensure this is initialized as an empty array
  const [loading, setLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(false); // State to track permission
  const { user } = useAuth();

  useEffect(() => {
    const loadProjects = async () => {
      if (!user?.studentId) {
        console.error("No student ID available.");
        setLoading(false);
        return;
      }

      try {
        const records = await getProjectByStudentId(user.studentId);
        // Ensure we are always setting an array
        setProjects(Array.isArray(records) ? records : []); // If it's not an array, set an empty array
      } catch (error) {
        console.error("Error fetching projects:", error);
        setProjects([]); // Set an empty array in case of an error
      } finally {
        setLoading(false);
      }
    };

    const checkPermission = async () => {
      if (!user?.studentId) return;

      const permission = await createProjectCheckPermission(user.studentId);
      setHasPermission(permission);
    };

    loadProjects();
    checkPermission();
  }, [user]);

  if (loading) return <Spinner />;

  const LimitedList = ({
    items,
    title,
  }: {
    items: { name?: string; id?: string }[];
    title: string;
  }) => {
    const [seeMore, setSeeMore] = useState(false);
    const visibleItems = seeMore ? items : items.slice(0, 3);

    return (
      <div>
        <h4 className="font-bold text-primary_text">{title}</h4>
        {visibleItems.map((item, index) => (
          <p key={index} className="text-sm">
            {item.id ? `${item.id} - ` : ""}
            {item.name || "No Data"}
          </p>
        ))}
        {items.length > 3 && (
          <p
            className="text-sm text-primary_text underline cursor-pointer mt-2"
            onClick={() => setSeeMore(!seeMore)}
          >
            {seeMore ? "See Less" : "See More"}
          </p>
        )}
      </div>
    );
  };

  const LimitedText = ({ text }: { text: string }) => {
    const [seeMore, setSeeMore] = useState(false);
    const isLongText = text.length > 150;

    return (
      <div className="bg-stone-50 border border-stone-200 rounded-lg p-4">
        <h4 className="text-primary_text font-bold mb-2">Project Description</h4>
        <p className="text-gray-700 leading-relaxed">
          {isLongText && !seeMore ? `${text.slice(0, 150)}...` : text}
        </p>
        {isLongText && (
          <button
            className="text-sm text-primary_text underline cursor-pointer mt-2"
            onClick={() => setSeeMore(!seeMore)}
          >
            {seeMore ? "Show Less" : "Show More"}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="bg-stone-100 min-h-screen p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
        <h1 className="text-4xl mb-1">
            Welcome,{" "}
            <span className="text-primary_text">
              {user?.firstName|| ""}
            </span>
          </h1>
          <h2 className="text-xl text-gray-600">
            You have{" "}
            <span className="text-widwa font-bold">
              {projects.length || "No"}
            </span>{" "}
            projects on your plate
          </h2>
        </div>
        {hasPermission && projects.length === 0 && (
          <CustomTooltip title="Create a new project" arrow>
            <button
              onClick={() => router.push("../../createproject")}
              className="bg-white text-primary_text font-bold px-6 py-2 rounded shadow-md hover:bg-gray-100 focus:outline-none flex items-center gap-2"
            >
              <AddIcon className="text-primary_text" /> Create Project
            </button>
          </CustomTooltip>
        )}
      </div>

      {/* Projects */}
      {projects.length === 0 ? (
        <p>No projects available</p> // Show a message if no projects are found
      ) : (
        projects.map((project, index) => (
          <div
            key={index}
            className="relative mb-6 border border-gray-200 rounded-lg shadow-sm bg-white"
          >
            <div className="p-4">
              {/* Edit Button - Top Right */}
              <button
                onClick={() => console.log("Edit", project.projectNo)}
                className="absolute top-4 right-4 p-2 rounded-full bg-blue-100 hover:bg-blue-200"
                aria-label="Edit Project"
              >
                <EditIcon />
              </button>

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
                    name: ` ${member.firstName || "No First Name"} ${member.lastName || "No Last Name"} (${member.studentId || "No Student ID"})`,
                  }))}
                  title="Members"
                />
                <LimitedList
                  items={project.staffs.map((staff) => ({
                    name: `${staff.prefix || ""} ${staff.firstName || "No First Name"} ${staff.lastName || "No Last Name"}`,
                  }))}
                  title="Advisor"
                />
              </div>

              {/* Project Description */}
              <div className="w-full">
                <LimitedText text={project.abstractText || "No Description"} />
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Dashboard;
