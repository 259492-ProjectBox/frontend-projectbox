'use client';
import React, { useEffect, useState } from 'react';
import { fetchConfigForm } from '@/utils/airtableConfigForm';
import { createProject } from '@/utils/airtableCreateProject';
import Spinner from '@/components/Spinner';

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
        console.error('Error fetching form config:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDropdownChange = (fieldName: string, value: string) => {
    setFormData({ ...formData, [fieldName]: value });
  };

  const getStatusDot = (status: string) => {
    const color = status === 'Active' ? 'bg-green-500' : status === 'Inactive' ? 'bg-red-500' : 'bg-gray-300';
    return <span className={`inline-block w-3 h-3 rounded-full ${color} mr-2`}></span>;
  };

  const handleSubmit = async () => {
    try {
      await createProject(formData);
      alert('Project created successfully!');
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project.');
    }
  };

  if (loading) return <Spinner />; 

  return (
    <div className="flex flex-col min-h-screen bg-stone-100 py-6">
      <div className="container mx-auto max-w-3xl">
        <h6 className="mb-4 text-lg font-bold">Config Form</h6>

        {/* Project Details Section */}
        <div className="p-6 mb-6 rounded-lg border border-gray-300 bg-white">
          <h6 className="text-lg font-bold mb-4">Project Details</h6>
          {['Course', 'Section', 'Term', 'Academic Year', 'ProjectTitle(TH)', 'ProjectTitle(EN)', 'Abstract'].map(field =>
            formConfig[field] && (
              <div key={field} className="flex items-center justify-between mb-4">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  {getStatusDot(formData[field])}
                  {field}
                </label>
                <select
                  value={formData[field] || ''}
                  onChange={e => handleDropdownChange(field, e.target.value)}
                  className="w-2/3 p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-widwa"
                >
                  <option value="">Select Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            )
          )}
        </div>

        {/* Student(s) Section */}
        {formConfig.Student && (
          <div className="p-6 mb-6 rounded-lg border border-gray-300 bg-white">
            <h6 className="text-lg font-bold mb-4">Student(s)</h6>
            <div className="flex items-center justify-between">
              <label className="flex items-center text-sm font-medium text-gray-700">
                {getStatusDot(formData.Student)}
                Student
              </label>
              <select
                value={formData.Student || ''}
                onChange={e => handleDropdownChange('Student', e.target.value)}
                className="w-2/3 p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-widwa"
              >
                <option value="">Select Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        )}

        {/* Advisor(s) Section */}
        {formConfig.ProjectAdvisor && (
          <div className="p-6 mb-6 rounded-lg border border-gray-300 bg-white">
            <h6 className="text-lg font-bold mb-4">Advisor(s)</h6>
            <div className="flex items-center justify-between">
              <label className="flex items-center text-sm font-medium text-gray-700">
                {getStatusDot(formData.ProjectAdvisor)}
                Advisor
              </label>
              <select
                value={formData.ProjectAdvisor || ''}
                onChange={e => handleDropdownChange('ProjectAdvisor', e.target.value)}
                className="w-2/3 p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-widwa"
              >
                <option value="">Select Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        )}

        {/* Upload(s) Section */}
        <div className="p-6 mb-6 rounded-lg border border-gray-300 bg-white">
          <h6 className="text-lg font-bold mb-4">Upload(s)</h6>
          {['Poster', 'Draft Report', 'Final Report', 'Final Presentation'].map(field =>
            formConfig[field] && (
              <div key={field} className="flex items-center justify-between mb-4">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  {getStatusDot(formData[field])}
                  {field}
                </label>
                <select
                  value={formData[field] || ''}
                  onChange={e => handleDropdownChange(field, e.target.value)}
                  className="w-2/3 p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-widwa"
                >
                  <option value="">Select Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            )
          )}
        </div>

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
