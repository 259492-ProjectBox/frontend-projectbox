import React from "react";
import { Project } from "@/models/Project";
import ProjectComponent from "@/components/dashboard/ProjectComponent"; // Import the ProjectComponent

interface PriorityProjectComponentProps {
  projects: Project[];
}

const PriorityProjectComponent: React.FC<PriorityProjectComponentProps> = ({ projects }) => {
  return (
    <div className="bg-stone-100 min-h-screen p-8">
      <h1 className="text-4xl mb-1">Priority Projects</h1>
      <p className="text-xl text-gray-600">This is a special view for priority users.</p>
      {projects.length === 0 ? (
        <p>No projects available</p>
      ) : (
        projects.map((project, index) => (
          <ProjectComponent key={index} project={project} />
        ))
      )}
    </div>
  );
};

export default PriorityProjectComponent;
