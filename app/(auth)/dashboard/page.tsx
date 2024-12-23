"use client";
import React, { useEffect, useState } from "react";
import { CustomTooltip } from "@/components/CustomTooltip";
import { useRouter } from "next/navigation";
import AddIcon from "@mui/icons-material/Add";
import { fetchProjects } from "@/utils/airtableCreateProject";
import Spinner from "@/components/Spinner";

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

  if (loading) return <Spinner />; // Use Spinner Component


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
            className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200"
            aria-label="Edit Project"
          >
            <svg
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
            >
              <path
                d="M20,16v4a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V6A2,2,0,0,1,4,4H8"
                fill="none"
                stroke="#000000"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              ></path>
              <polygon
                fill="none"
                points="12.5 15.8 22 6.2 17.8 2 8.3 11.5 8 16 12.5 15.8"
                stroke="#000000"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              ></polygon>
            </svg>
          </button>
      
          {/* Project Title */}
          <div>
            <h3 className="text-sm font-semibold text-red-500">
              Project No: {project.projectNo}
            </h3>
            <h4 className="text-xl font-bold text-gray-800 mb-2">
              {project.projectId} — {project.projectName}
            </h4>
          </div>
      
          {/* Icons - Below Project Title */}
          <div className="flex gap-4 mb-4">
            {/* File Icon */}
            <button className="p-2 bg-teal-100 rounded hover:bg-teal-200">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                <path
                  d="M19 9V17.8C19 18.9201 19 19.4802 18.782 19.908C18.5903 20.2843 18.2843 20.5903 17.908 20.782C17.4802 21 16.9201 21 15.8 21H8.2C7.07989 21 6.51984 21 6.09202 20.782C5.71569 20.5903 5.40973 20.2843 5.21799 19.908C5 19.4802 5 18.9201 5 17.8V6.2C5 5.07989 5 4.51984 5.21799 4.09202C5.40973 3.71569 5.71569 3.40973 6.09202 3.21799C6.51984 3 7.0799 3 8.2 3H13M19 9L13 3M19 9H14C13.4477 9 13 8.55228 13 8V3"
                  stroke="#000000"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
              </svg>
            </button>
      
            {/* YouTube Icon */}
            <button className="p-2 bg-teal-100 rounded hover:bg-teal-200">
              <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                <path
                  className="a"
                  d="M43.1124,14.394a5.0056,5.0056,0,0,0-3.5332-3.5332c-2.3145-.8936-24.7326-1.3314-31.2358.0256A5.0059,5.0059,0,0,0,4.81,14.42c-1.0446,4.583-1.1239,14.4914.0256,19.1767A5.006,5.006,0,0,0,8.369,37.13c4.5829,1.0548,26.3712,1.2033,31.2358,0a5.0057,5.0057,0,0,0,3.5332-3.5333C44.2518,28.6037,44.3311,19.31,43.1124,14.394Z"
                ></path>
                <path className="a" d="M30.5669,23.9952,20.1208,18.004V29.9863Z"></path>
              </svg>
            </button>
      
            {/* GitHub Icon */}
            <button className="p-2 bg-teal-100 rounded hover:bg-teal-200">
              <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                <path
                  className="cls-1"
                  d="M24,2.5a21.5,21.5,0,0,0-6.8,41.9c1.08.2,1.47-.46,1.47-1s0-1.86,0-3.65c-6,1.3-7.24-2.88-7.24-2.88A5.7,5.7,0,0,0,9,33.68c-1.95-1.33.15-1.31.15-1.31a4.52,4.52,0,0,1,3.29,2.22c1.92,3.29,5,2.34,6.26,1.79a4.61,4.61,0,0,1,1.37-2.88c-4.78-.54-9.8-2.38-9.8-10.62a8.29,8.29,0,0,1,2.22-5.77,7.68,7.68,0,0,1,.21-5.69s1.8-.58,5.91,2.2a20.46,20.46,0,0,1,10.76,0c4.11-2.78,5.91-2.2,5.91-2.2a7.74,7.74,0,0,1,.21,5.69,8.28,8.28,0,0,1,2.21,5.77c0,8.26-5,10.07-9.81,10.61a5.12,5.12,0,0,1,1.46,4c0,2.87,0,5.19,0,5.9s.39,1.24,1.48,1A21.5,21.5,0,0,0,24,2.5"
                ></path>
              </svg>
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
