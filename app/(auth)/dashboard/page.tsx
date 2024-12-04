"use client";
import React, { useEffect, useState } from "react";
import ProjectList from "../../../components/ProjectList";
import { CustomTooltip } from "@/components/CustomTooltip";
import { useRouter } from "next/navigation";
import AddIcon from "@mui/icons-material/Add"; // Import Add icon
import { fetchProjects } from "@/utils/airtableCreateProject"; // Import Airtable fetch function

// Define TypeScript interfaces for better type safety
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
                name: "Unknown Student", // Replace with actual student name if available
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

  if (loading) {
    return <div>Loading projects...</div>;
  }

  return (
    <div className="bg-stone-100 min-h-screen p-8">
      {/* Header Section */}
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
            onClick={() => {
              router.push("../../createproject");
            }}
            className="bg-white text-red-700 font-bold px-6 py-2 rounded shadow-md hover:bg-gray-100 focus:outline-none flex items-center gap-2"
          >
            <AddIcon className="text-red-700" /> Create Project
          </button>
        </CustomTooltip>
      </div>

      {/* Projects List Section */}
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
                <p className="text-gray-600 mt-2">{project.description}</p>
              </div>
              <div className="flex-1 mb-4 md:mb-0">
                <h4 className="font-bold text-teal-600">Students</h4>
                {project.students.map((student: Student) => (
                  <p key={student.id} className="text-sm">
                    {student.id} - {student.name}
                  </p>
                ))}
              </div>
              <div className="flex-1 flex flex-col">
                <h4 className="font-bold text-teal-600">Committees</h4>
                {project.committees.map((committee: Committee, idx: number) => (
                  <div key={idx} className="flex items-center">
                    <p className="text-sm">{committee.name}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-teal-50 p-4 rounded-lg mt-4">
              <h4 className="font-bold text-teal-600">Project Description</h4>
              <p className="text-gray-600 mt-2">{project.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;
