'use client';
import React, { useEffect, useState } from 'react';
import Spinner from '@/components/Spinner';
import getProjectConfig from '@/utils/configform/getProjectConfig';

const CreateProject: React.FC = () => {
  const [formConfig, setFormConfig] = useState<any>({});
  const [formData, setFormData] = useState<Record<string, any>>({});
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
    advisor: 'Advisor',
    co_advisor: 'Co-Advisor',
    committee: 'Committee Members',
    external_committee: 'External Committee Members',
    report_pdf: 'Report PDF',
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
    setFormData((prevData: Record<string, any>) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const files = e.target.files;
    if (files) {
      const fileUrls = Array.from(files).map((file) => ({
        url: URL.createObjectURL(file),
      }));
      setFormData((prevData: Record<string, any>) => ({ ...prevData, [fieldName]: fileUrls }));
    }
  };

  const renderInputField = (field: string, label: string, isRequired: boolean, type: string = 'text') => (
    <div className="mb-4">
      <label className="block mb-1 text-sm font-medium text-gray-700">
        {label} {isRequired && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        name={field}
        value={formData[field] || ''}
        onChange={handleInputChange}
        className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-widwa"
        placeholder={`Enter ${label}`}
      />
    </div>
  );

  const renderTextArea = (field: string, label: string, isRequired: boolean) => (
    <div className="mb-6">
      <label className="block mb-1 text-sm font-medium text-gray-700">
        {label} {isRequired && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        name={field}
        value={formData[field] || ''}
        onChange={handleInputChange}
        rows={3}
        className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-widwa resize-y"
        placeholder={`Enter ${label}`}
      />
    </div>
  );

  const renderFields = (fields: string[]) =>
    fields.map(
      (field) =>
        formConfig[field] && (
          <div key={field}>
            {field === 'abstract_text'
              ? renderTextArea(field, labels[field], requiredFields.includes(field))
              : renderInputField(field, labels[field], requiredFields.includes(field))}
          </div>
        )
    );

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

        {/* Project Details Section */}
        <div className="p-6 mb-6 rounded-lg border border-gray-300 bg-white">
          <h6 className="text-lg font-bold mb-4">Project Details</h6>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {renderFields(['course_id', 'section_id', 'semester', 'academic_year'])}
          </div>
          {renderFields(['title_en', 'title_th'])}
          {renderFields(['abstract_text'])}
        </div>

        {/* Students, Advisors, Co-Advisor, Committee, External Committee Section */}
        <div className="p-6 mb-6 rounded-lg border border-gray-300 bg-white">
          <h6 className="text-lg font-bold mb-4">Team Details</h6>
          {renderFields(['student', 'advisor', 'co_advisor', 'committee', 'external_committee'])}
        </div>

        {/* File Uploads Section */}
        {formConfig['report_pdf'] && (
          <div className="p-4 mb-4 rounded-lg border border-gray-300 bg-white">
            <h6 className="text-lg font-bold mb-4">{labels['report_pdf']}</h6>
            <input
              type="file"
              name="report_pdf"
              onChange={(e) => handleFileChange(e, 'report_pdf')}
              className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-widwa"
            />
          </div>
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
