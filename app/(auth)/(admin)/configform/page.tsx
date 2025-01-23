"use client";
import React, { useEffect, useState } from "react";
import Spinner from "@/components/Spinner";
import { FormData } from "@/models/configform";
import Section from "@/components/configform/Section";
import getProjectConfig from "@/utils/configform/getProjectConfig";
import updateProjectConfigs from "@/utils/configform/updateProjectConfigs";
import { ProjectConfig } from "@/models/ProjectConfig"; // Import the interface

const CreateProject: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [apiData, setApiData] = useState<ProjectConfig[]>([]); // Use the interface for type safety

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const data: ProjectConfig[] = await getProjectConfig(2); // Fetch project config for major ID 1

      // Map API response to formData
      const initialFormData = data.reduce((acc: Record<string, boolean>, item: ProjectConfig) => {
        acc[item.title] = item.is_active;
        return acc;
      }, {});

      setFormData(initialFormData);
      setApiData(data); // Save the original API data
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleToggleChange = (fieldName: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: !prevData[fieldName],
    }));
  };

  const handleSubmit = async () => {
    // Convert formData back into the API format
    const updatedConfigs: ProjectConfig[] = apiData.map((item) => ({
      id: item.id,
      is_active: formData[item.title], 
      program_id: item.program_id,
      title: item.title,
    }));

    try {
      await updateProjectConfigs(updatedConfigs);
      alert("Configuration updated successfully!");
    } catch (error) {
      alert("Failed to update configuration. Please try again.");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="flex flex-col min-h-screen bg-stone-100 py-6">
      <div className="container mx-auto max-w-3xl">
        <h6 className="mb-4 text-lg font-bold">Create Project Form</h6>

        {/* Section 1: Project Details */}
        <Section
          title="Project Details"
          fields={["title_th", "title_en", "abstract_text", "academic_year", "semester", "section_id", "course_id"]}
          formData={formData}
          onToggle={handleToggleChange}
        />

        {/* Section 2: Advisor */}
        <Section
          title="Members"
          fields={["advisor","co-advisor","external-committee","committee","student"]}
          formData={formData}
          onToggle={handleToggleChange}
        />

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default CreateProject;
