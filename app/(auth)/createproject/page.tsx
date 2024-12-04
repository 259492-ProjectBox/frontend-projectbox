'use client';
import React, { useEffect, useState } from 'react';
import { fetchConfigForm } from '@/utils/airtableConfigForm'; // Utility to fetch form configuration
import { createProject } from '@/utils/airtableCreateProject'; // Utility to create a project

const CreateProject: React.FC = () => {
  const [formConfig, setFormConfig] = useState<any>({});
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = await fetchConfigForm();
        setFormConfig(config);
      } catch (error) {
        console.error("Error fetching form config:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const files = e.target.files;
    if (files) {
      const fileUrls = Array.from(files).map(file => ({
        url: URL.createObjectURL(file), // Replace this with actual file upload logic in production
      }));
      setFormData({ ...formData, [fieldName]: fileUrls });
    }
  };

  const handleSubmit = async () => {
    try {
      await createProject(formData);
      alert("Project created successfully!");
    } catch (error) {
      console.error("Error creating project:", error);
      alert("Failed to create project.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-stone-100 py-6">
      <div className="container mx-auto max-w-3xl">
        <h6 className="mb-4 text-lg font-bold">Create Project</h6>

        {/* Project Detail Section */}
        <div className="p-6 mb-6 rounded-lg border border-gray-300 bg-white">
          <div className="border-l-4 border-widwa pl-4 mb-6">
            <h6 className="text-lg">Project Details</h6>
          </div>

          {/* Department Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {formConfig.Course && (
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Course</label>
                <input
                  type="text"
                  name="Course"
                  value={formData.Course || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-widwa"
                  placeholder="Enter course code"
                />
              </div>
            )}
            {formConfig.Section && (
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Section</label>
                <input
                  type="text"
                  name="Section"
                  value={formData.Section || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-widwa"
                  placeholder="Enter section"
                />
              </div>
            )}
            {formConfig.Term && (
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Term</label>
                <input
                  type="text"
                  name="Term"
                  value={formData.Term || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-widwa"
                  placeholder="Enter term"
                />
              </div>
            )}
            {formConfig["Academic Year"] && (
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Academic Year</label>
                <input
                  type="text"
                  name="Academic Year"
                  value={formData["Academic Year"] || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-widwa"
                  placeholder="Enter academic year"
                />
              </div>
            )}
          </div>

          {/* Project Title Fields */}
          {formConfig["ProjectTitle(EN)"] && (
            <div className="mb-6">
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Project Title (EN) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="ProjectTitle(EN)"
                value={formData["ProjectTitle(EN)"] || ""}
                onChange={handleInputChange}
                className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-widwa"
                placeholder="Enter project title (English)"
              />
            </div>
          )}
          {formConfig["ProjectTitle(TH)"] && (
            <div className="mb-6">
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Project Title (TH) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="ProjectTitle(TH)"
                value={formData["ProjectTitle(TH)"] || ""}
                onChange={handleInputChange}
                className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-widwa"
                placeholder="Enter project title (Thai)"
              />
            </div>
          )}

          {/* Project Abstract */}
          {formConfig.Abstract && (
            <div className="mb-6">
              <label className="block mb-1 text-sm font-medium text-gray-700">Abstract</label>
              <textarea
                name="Abstract"
                value={formData.Abstract || ""}
                onChange={handleInputChange}
                className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-widwa"
                rows={4}
                placeholder="Enter abstract"
              />
            </div>
          )}
        </div>

        {/* Advisor Section */}
        {formConfig.ProjectAdvisor && (
          <div className="p-4 mb-4 rounded-lg border border-gray-300 bg-white">
            <label className="block mb-1 text-sm font-medium text-gray-700">Advisor(s)</label>
            <input
              type="text"
              name="ProjectAdvisor"
              value={formData.ProjectAdvisor || ""}
              onChange={handleInputChange}
              className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-widwa"
              placeholder="Enter advisors (comma-separated)"
            />
          </div>
        )}

        {/* Student Section */}
        {formConfig.Student && (
          <div className="p-4 mb-4 rounded-lg border border-gray-300 bg-white">
            <label className="block mb-1 text-sm font-medium text-gray-700">Students</label>
            <input
              type="text"
              name="Student"
              value={formData.Student || ""}
              onChange={handleInputChange}
              className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-widwa"
              placeholder="Enter student IDs (comma-separated)"
            />
          </div>
        )}

        {/* YouTube Link Section */}
        {formConfig["YouTube Link"] && (
          <div className="p-4 mb-4 rounded-lg border border-gray-300 bg-white">
            <label className="block mb-1 text-sm font-medium text-gray-700">YouTube Link</label>
            <input
              type="url"
              name="YouTube Link"
              value={formData["YouTube Link"] || ""}
              onChange={handleInputChange}
              className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-widwa"
              placeholder="Enter YouTube link"
            />
          </div>
        )}

        {/* File Upload Fields */}
        {['Poster', 'Draft Report', 'Final Report', 'Final Presentation'].map(
          field =>
            formConfig[field] && (
              <div key={field} className="mb-4">
                <label className="block mb-1 text-sm font-medium text-gray-700">{field}</label>
                <input
                  type="file"
                  multiple
                  onChange={e => handleFileChange(e, field)}
                  className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-widwa"
                />
              </div>
            )
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default CreateProject;
