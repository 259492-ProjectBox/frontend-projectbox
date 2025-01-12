'use client';
import React, { useEffect, useState } from 'react';
import Spinner from '@/components/Spinner';
import getProjectConfig from '@/utils/configform/getProjectConfig';
import Advisors from '@/components/formField/Advisors';
import Committees from '@/components/formField/Committees';
import FileUploads from '@/components/formField/FileUploads';
import ProjectDetails from '@/components/formField/ProjectDetails';
import Students from '@/components/formField/Students';

const CreateProject: React.FC = () => {
  const [formConfig, setFormConfig] = useState<any>({});
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(true);

  const labels: Record<string, string> = {
    course_id: 'Course',
    section_id: 'Section',
    semester: 'Semester',
    academic_year: 'Academic Year',
    title_en: 'Project Title (EN)',
    title_th: 'Project Title (TH)',
    abstract_text: 'Abstract',
    student: 'Students',
    advisor: 'Advisors',
    committee: 'Committee Members',
    report_pdf: 'Report PDF',
    poster_picture: 'Poster Picture',
    presentation_ppt: 'Presentation (.ppt)',
    presentation_pdf: 'Presentation (.pdf)',
    youtube_link: 'YouTube Link',
    github_link: 'GitHub Link',
    optional_link: 'Optional Link',
    sketchup_file: 'SketchUp File (.skp)',
    autocad_file: 'AutoCAD File (.cad)',
  };

  const requiredFields: string[] = ['course_id', 'title_en', 'student', 'committee', 'report_pdf'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = await getProjectConfig(2); // Replace '2' with the appropriate `majorId`
        const activeFields = config.reduce((acc, field) => {
          if (field.is_active) acc[field.title] = true;
          return acc;
        }, {});
        setFormConfig(activeFields);
      } catch (error) {
        console.error('Error fetching form config:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const files = e.target.files;
    if (files) {
      const fileUrls = Array.from(files).map((file) => ({
        url: URL.createObjectURL(file),
      }));
      setFormData({ ...formData, [fieldName]: fileUrls });
    }
  };

  const handleSubmit = async () => {
    try {
      console.log('Form Data:', formData);
      alert('Form submitted! Check the console for details.');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit the form.');
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="flex flex-col min-h-screen bg-stone-100 py-6">
      <div className="container mx-auto max-w-3xl">
        <h6 className="mb-4 text-lg font-bold">Create Project</h6>

        {/* Project Details */}
        <ProjectDetails
          formConfig={formConfig}
          formData={formData}
          onInputChange={handleInputChange}
          labels={labels}
          requiredFields={requiredFields}
        />

        {/* Students */}
        <Students
          formConfig={formConfig}
          formData={formData}
          onInputChange={handleInputChange}
          label={labels['student']}
          required={requiredFields.includes('student')}
        />

        {/* Advisors */}
        <Advisors
          formConfig={formConfig}
          formData={formData}
          onInputChange={handleInputChange}
          label={labels['advisor']}
        />

        {/* Committees */}
        <Committees
          formConfig={formConfig}
          formData={formData}
          onInputChange={handleInputChange}
          label={labels['committee']}
          required={requiredFields.includes('committee')}
        />

        {/* File Uploads */}
        <FileUploads
          formConfig={formConfig}
          formData={formData}
          onFileChange={handleFileChange}
          labels={labels}
          requiredFields={requiredFields}
        />

        <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
          Submit
        </button>
      </div>
    </div>
  );
};

export default CreateProject;
