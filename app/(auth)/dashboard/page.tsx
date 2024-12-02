"use client";
import React from "react";
import ProjectList from "../../../components/ProjectList";
import { CustomTooltip } from "@/components/CustomTooltip";
import { useRouter } from "next/navigation";
import AddIcon from "@mui/icons-material/Add"; // Import Add icon

const projects = [
  {
    projectNo: "EE-S008-2/66",
    projectId: "252490",
    projectName: "Project Survey",
    description:
      "Survey and Analysis of Power Quality Issues in Local Electrical Grids. Power quality is a critical aspect of modern electrical systems, affecting both residential and industrial consumers. Common issues like voltage sags, swells, harmonic distortions, and interruptions can lead to equipment malfunctions, increased energy consumption, and operational costs.",
    students: [
      { id: "640610999", name: "ประยุทธ์ จันทร์โอชา" },
      { id: "640611000", name: "ประวิตร วงศุวรรณ" },
      { id: "640611001", name: "ประเศริฐ จิระจันทน์" },
    ],
    committees: [
      { name: "ผศ. โดม โพธิกานนท์" },
      { name: "ผศ.ดร. บวรศักดิ์ คุมสินกิจ" },
      { name: "ผศ.ดร. ธนาทิพย์ จันทร์คิง" },
    ],
  },
  // Add more projects if needed
];

function Dashboard() {
  const router = useRouter();

  return (
    <div className="bg-stone-100 min-h-screen p-8">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-4xl mb-1">
            Welcome, <span className="text-widwa">Pichayoot</span>
          </h1>
          <h2 className="text-xl text-gray-600">
            You have <span className="text-widwa font-bold">{projects.length}</span> projects in your plate
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
                <p className="text-gray-600 mt-2">
                  Survey and Analysis of Power Quality Issues in Local Electrical Grids
                </p>
              </div>
              <div className="flex-1 mb-4 md:mb-0">
                <h4 className="font-bold text-teal-600">Students</h4>
                {project.students.map((student) => (
                  <p key={student.id} className="text-sm">
                    {student.id} - {student.name}
                  </p>
                ))}
              </div>
              <div className="flex-1 flex flex-col">
                <h4 className="font-bold text-teal-600">Committees</h4>
                {project.committees.map((committee, idx) => (
                  <div key={idx} className="flex items-center">
                    <p className="text-sm"> {committee.name}</p>
                    {idx === project.committees.length - 1 && (
                      <button className="ml-2 text-xs focus:outline-none">✎</button>
                    )}
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