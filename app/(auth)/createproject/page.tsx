'use client';
import React, { useEffect, useState } from 'react';
import { fetchConfigForm } from '@/utils/airtableConfigForm';
import { createProject } from '@/utils/airtableCreateProject';
import ProjectDetails from '@/components/formField/ProjectDetails';
import StudentSelect from '@/components/formField/StudentSelect';
import CommitteeSelect from '@/components/formField/CommitteeSelect';
import FileUpload from '@/components/formField/FileUpload';

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const files = e.target.files;
    if (files) {
      const fileUrls = Array.from(files).map(file => ({
        url: URL.createObjectURL(file),
      }));
      setFormData({ ...formData, [fieldName]: fileUrls });
    }
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

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col min-h-screen bg-stone-100 py-6">
      <div className="container mx-auto max-w-3xl">
        <h6 className="mb-4 text-lg font-bold">Create Project</h6>
        
        {/* Project Details */}
        <ProjectDetails formConfig={formConfig} formData={formData} onInputChange={handleInputChange} />
        
        {/* Students */}
        <StudentSelect formConfig={formConfig} formData={formData} onInputChange={handleInputChange} />
        
        {/* Committees */}
        <CommitteeSelect formConfig={formConfig} formData={formData} onInputChange={handleInputChange} />
        
        {/* File Upload */}
        <FileUpload formConfig={formConfig} onFileChange={handleFileChange} />

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
