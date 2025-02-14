"use client";
import React, { useEffect, useState } from "react";
import getProjectByStudentId from "@/utils/dashboard/getProjectByStudentId";
import { Project } from "@/models/Project";
import Spinner from "@/components/Spinner";
import AddIcon from "@mui/icons-material/Add";
import { CustomTooltip } from "@/components/CustomTooltip";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { createProjectCheckPermission } from "@/utils/dashboard/createProjectCheckPermission"; // Import the new utility function
import ProjectComponent from "@/components/dashboard/ProjectComponent"; // Import the new ProjectComponent

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
    items: { name?: string; role?: string; id?: string }[];
    title: string;
  }) => {
    const [seeMore, setSeeMore] = useState(false);
    const visibleItems = seeMore ? items : items.slice(0, 3);

    return (
      <div>
        <h4 className="font-bold text-primary_text">{title}</h4>
        {visibleItems.map((item, index) => (
          <p key={index} className="text-sm">
            {item.name || "No Data"} {item.id ? `(${item.id})` : ""} {item.role ? `(${item.role})` : ""}
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
          <ProjectComponent key={index} project={project} />
        ))
      )}
    </div>
  );
}

export default Dashboard;
