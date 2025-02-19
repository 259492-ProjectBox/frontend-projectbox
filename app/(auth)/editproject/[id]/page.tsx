"use client";

import React, { useEffect, useState } from "react";
import Spinner from "@/components/Spinner";
import { Project } from "@/models/Project";
import getProjectById from "@/utils/projects/getProjectById";

interface EditProjectPageProps {
  params: {
    id: string;
  };
}

const EditProjectPage: React.FC<EditProjectPageProps> = ({ params }) => {
  const { id } = params; // Get project ID from the route params
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProject = async () => {
      try {
        const projectData = await getProjectById(parseInt(id)); // Fetch project by ID
        setProject(projectData);
      } catch (error) {
        console.error("Error fetching project details:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [id]);

  if (loading) return <Spinner />;
  if (!project) return <p>No project found.</p>;

  return (
    <div>
      <h1>Edit Project</h1>
      <p>Project ID: {id}</p>
      {/* Add your form or other components here */}
      <div>
        <h2>Project Details</h2>
        <p>Project No: {project.projectNo || "No Data"}</p>
        <p>Title (EN): {project.titleEN || "No Title"}</p>
        <p>Title (TH): {project.titleTH || "No Title"}</p>
        <p>Description: {project.abstractText || "No Description"}</p>
        {/* Add more fields as needed */}
      </div>
    </div>
  );
};

export default EditProjectPage;
