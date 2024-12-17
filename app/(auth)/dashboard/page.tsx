"use client";
import React, { useEffect, useState } from "react";
import { CustomTooltip } from "@/components/CustomTooltip";
import { useRouter } from "next/navigation";
import AddIcon from "@mui/icons-material/Add";
import { fetchProjects } from "@/utils/airtableCreateProject";

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

  if (loading) return <div>Loading projects...</div>;

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
    const isLongText = text.length > 150; // Set threshold for long text

    return (
      <div>
        <p className="text-gray-600">
          {isLongText && !seeMore ? `${text.slice(0, 150)}...` : text}
        </p>
        {isLongText && (
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
            <span className="text-widwa font-bold">{projects.length}</span> projects
            on your plate
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
          className="mb-6 border border-gray-200 rounded-lg shadow-none bg-white"
        >
          <div className="p-4">
            <div className="flex flex-col md:flex-row justify-between mb-4">
              <div className="flex-1 mb-4 md:mb-0">
                <h3 className="text-xl font-bold text-widwa">
                  Project No: {project.projectNo}
                </h3>
                <h4 className="text-2xl">
                  {project.projectId} - {project.projectName}
                </h4>
                <LimitedText text={project.description} />
              </div>
              <div className="flex-1 mb-4 md:mb-0">
                <LimitedList items={project.students} title="Students" />
              </div>
              <div className="flex-1">
                <LimitedList items={project.committees} title="Committees" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;
