"use client";
import React, { useEffect, useState } from "react";
import { CustomTooltip } from "@/components/CustomTooltip";
import { useRouter } from "next/navigation";
import AddIcon from "@mui/icons-material/Add";
import { fetchProjects } from "@/utils/airtableCreateProject";
import Spinner from "@/components/Spinner";
import EditIcon from "@/public/Svg/EditIcon";
import FileIcon from "@/public/Svg/FileIcon";
import YouTubeIcon from "@/public/Svg/YouTubeIcon";
import GitHubIcon from "@/public/Svg/GitHubIcon";
import AutoCADIcon from "@/public/Svg/AutoCADIcon";
import LinkIcon from "@/public/Svg/LinkIcon";
import PictureIcon from "@/public/Svg/PictureIcon";
import PowerPointIcon from "@/public/Svg/PowerPointIcon";
import SketchupIcon from "@/public/Svg/SketchupIcon";

interface Student {
  id: string;
  name: string;
}

interface Committee {
  name: string;
}

interface Project {
  projectNo: string;
  projectId: string;
  projectName: string;
  description: string;
  students: Student[];
  committees: Committee[];
}

function Dashboard() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const records = await fetchProjects();
        const formattedProjects: Project[] = records.map((record: any) => ({
          projectNo: record.fields.ID || "N/A",
          projectId: record.fields.Course || "N/A",
          projectName: record.fields["ProjectTitle(EN)"] || "Untitled",
          description: record.fields.Abstract || "No description available.",
          students: record.fields.Student
            ? record.fields.Student.split(",").map((id: string) => ({
                id: id.trim(),
                name: "Unknown Student",
              }))
            : [],
          committees: record.fields.ProjectAdvisor
            ? record.fields.ProjectAdvisor.split(",").map((name: string) => ({
                name: name.trim(),
              }))
            : [],
        }));
        setProjects(formattedProjects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

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
        <h4 className="font-bold text-teal-600">{title}</h4>
        {visibleItems.map((item, index) => (
          <p key={index} className="text-sm">
            {item.id ? `${item.id} - ` : ""}
            {item.name || "Unknown"}
          </p>
        ))}
        {items.length > 3 && (
          <p
            className="text-sm text-teal-600 underline cursor-pointer mt-2"
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
      <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
        <h4 className="text-teal-600 font-bold mb-2">Project Description</h4>
        <p className="text-gray-700 leading-relaxed">
          {isLongText && !seeMore ? `${text.slice(0, 150)}...` : text}
        </p>
        {isLongText && (
          <button
            className="text-sm text-teal-600 underline cursor-pointer mt-2"
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
            Welcome, <span className="text-widwa">Pichayoot</span>
          </h1>
          <h2 className="text-xl text-gray-600">
            You have{" "}
            <span className="text-widwa font-bold">{projects.length}</span>{" "}
            projects on your plate
          </h2>
        </div>
        <CustomTooltip title="Create a new project" arrow>
          <button
            onClick={() => router.push("../../createproject")}
            className="bg-white text-red-700 font-bold px-6 py-2 rounded shadow-md hover:bg-gray-100 focus:outline-none flex items-center gap-2"
          >
            <AddIcon className="text-red-700" /> Create Project
          </button>
        </CustomTooltip>
      </div>

      {/* Projects */}
      {projects.map((project, index) => (
        <div
          key={index}
          className="relative mb-6 border border-gray-200 rounded-lg shadow-sm bg-white"
        >
          <div className="p-4">
            {/* Edit Button - Top Right */}
            <button
              onClick={() => console.log("Edit", project.projectNo)}
              className="absolute top-4 right-4 p-2 rounded-full bg-red-100 hover:bg-red-200"
              aria-label="Edit Project"
            >
              <EditIcon />
            </button>

            {/* Project Title */}
            <div>
              <h3 className="text-sm font-semibold text-red-700">
                Project No: {project.projectNo}
              </h3>
              <h4 className="text-xl font-bold text-gray-800 mb-2">
                {project.projectId} — {project.projectName}
              </h4>
            </div>

            {/* Icons - Below Project Title */}
            <div className="flex flex-wrap gap-4 mb-4">
              {/* File Icon */}
              <button className="p-2 bg-sky-100 rounded hover:bg-sky-200">
                <FileIcon />
              </button>

              {/* YouTube Icon */}
              <button className="p-2 bg-red-100 rounded hover:bg-red-200">
                <YouTubeIcon />
              </button>

              {/* GitHub Icon */}
              <button className="p-2 bg-gray-100 rounded hover:bg-gray-200">
                <GitHubIcon />
              </button>

              {/* PowerPoint Icon */}
              <button className="p-2 bg-orange-100 rounded hover:bg-orange-200">
                <PowerPointIcon />
              </button>

              {/* Picture Icon */}
              <button className="p-2 bg-blue-100 rounded hover:bg-blue-200">
                <PictureIcon />
              </button>

              {/* AutoCAD Icon */}
              <button className="p-2 bg-red-100 rounded hover:bg-red-200">
                <AutoCADIcon />
              </button>

              {/* Sketchup Icon */}
              <button className="p-2 bg-blue-100 rounded hover:bg-blue-200">
                <SketchupIcon />
              </button>

              {/* Link Icon */}
              <button className="p-2 bg-green-100 rounded hover:bg-green-200">
                <LinkIcon />
              </button>
            </div>

            {/* Students and Committees */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <LimitedList items={project.students} title="Students" />
              <LimitedList items={project.committees} title="Committees" />
            </div>

            {/* Project Description */}
            <div className="w-full">
              <LimitedText text={project.description} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;
