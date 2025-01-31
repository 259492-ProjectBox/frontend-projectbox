"use client";
import React, { useEffect, useState } from "react";
import getProjectByStudentId from "@/utils/dasboard/getProjectByStudentId";
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

function Dashboard() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const records = await getProjectByStudentId("640610304"); 
        setProjects(records || []);
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
            Welcome, <span className="text-widwa">Pichayoot</span>
          </h1>
          <h2 className="text-xl text-gray-600">
            You have{" "}
            <span className="text-widwa font-bold">
              {projects.length || "No"}
            </span>{" "}
            projects on your plate
          </h2>
        </div>
        {/* <CustomTooltip title="Create a new project" arrow>
          <button
            onClick={() => router.push("../../createproject")}
            className="bg-white text-primary_text font-bold px-6 py-2 rounded shadow-md hover:bg-gray-100 focus:outline-none flex items-center gap-2"
          >
            <AddIcon className="text-primary_text" /> Create Project
          </button>
        </CustomTooltip> */}
      </div>

      {/* Projects */}
      
    </div>
  );
}

export default Dashboard;
