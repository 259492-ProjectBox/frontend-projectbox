"use client";
import React, { useEffect, useState } from "react";
import Spinner from "@/components/Spinner";
import { FormData } from "@/models/configform";
import Section from "@/components/configform/Section";
import getProjectConfig from "@/utils/configform/getProjectConfig";
import updateProjectConfigs from "@/utils/configform/updateProjectConfigs";
import { ProjectConfig } from "@/models/ProjectConfig";
import MockTableSection from "@/components/configform/upload";
import getAllProgram from "@/utils/getAllProgram";
import { AllProgram } from "@/models/AllPrograms";

const CreateProject: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [apiData, setApiData] = useState<ProjectConfig[]>([]);

  // Major selector states (for display only; not filtering data)
  const [majorList, setMajorList] = useState<AllProgram[]>([]);
  const [selectedMajor, setSelectedMajor] = useState<number>(1); // Default

  // 1) Fetch project config by fixed major ID (1)
  const fetchConfig = async () => {
    try {
      setLoading(true);
      const data: ProjectConfig[] = await getProjectConfig(1);
      // Map API response to formData
      const initialFormData = data.reduce(
        (acc: Record<string, boolean>, item: ProjectConfig) => {
          acc[item.title] = item.is_active;
          return acc;
        },
        {}
      );
      setFormData(initialFormData);
      setApiData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2) Fetch major list (for the selector)
  useEffect(() => {
    const fetchMajors = async () => {
      try {
        const data = await getAllProgram();
        setMajorList(data);
      } catch (err) {
        console.error("Error fetching major list:", err);
      }
    };
    fetchMajors();
  }, []);

  // 3) Call fetchConfig once on mount
  useEffect(() => {
    fetchConfig();
  }, []);

  // Toggle fields
  const handleToggleChange = (fieldName: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: !prevData[fieldName],
    }));
  };

  // Convert updated formData back to API format & submit
  const handleSubmit = async () => {
    const updatedConfigs: ProjectConfig[] = apiData.map((item) => ({
      id: item.id,
      is_active: formData[item.title],
      program_id: item.program_id,
      title: item.title,
      imageUrl: "",
    }));

    try {
      await updateProjectConfigs(updatedConfigs);
      alert("Configuration updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to update configuration. Please try again.");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="flex flex-col min-h-screen bg-stone-100 py-6">
      <div className="container mx-auto max-w-5xl">
        
        {/* 1) Major Selector Container */}
        <div className="mb-5 p-4 rounded-md shadow-sm border border-gray-200 bg-white">
          <label
            htmlFor="majorSelect"
            className="block mb-2 text-sm font-semibold text-gray-700"
          >
            Program:
          </label>
          <select
            id="majorSelect"
            value={selectedMajor}
            onChange={(e) => setSelectedMajor(Number(e.target.value))}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded 
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {majorList.map((major) => (
              <option key={major.id} value={major.id}>
                {major.program_name_en}
              </option>
            ))}
          </select>
        </div>

        {/* Page Heading */}
        <h2 className="mb-4 text-xl font-bold text-gray-800">
          Create Project Form
        </h2>

        {/* 2) Single Container for BOTH sections + Save Button */}
        <div className="p-6 bg-white border border-gray-200 rounded-md shadow-sm mb-6">
          {/* 2-column layout for Project Details & Members */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column: Project Details */}
            <Section
              title="Project Details"
              fields={[
                "title_th",
                "title_en",
                "abstract_text",
                "academic_year",
                "semester",
                "section_id",
                "course_id",
              ]}
              formData={formData}
              onToggle={handleToggleChange}
            />

            {/* Right Column: Members */}
            <Section
              title="Members"
              fields={[
                "advisor",
                "co-advisor",
                "external-committee",
                "committee",
                "student",
              ]}
              formData={formData}
              onToggle={handleToggleChange}
            />
          </div>

          {/* Save Button aligned to the right */}
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              className="bg-primary_button text-white py-1 px-3 rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </div>

        {/* 3) Mock Table Section (Upload Resource) */}
        <MockTableSection />
      </div>
    </div>
  );
};

export default CreateProject;
