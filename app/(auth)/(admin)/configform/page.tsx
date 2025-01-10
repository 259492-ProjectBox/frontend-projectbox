'use client';
import React, { useEffect, useState } from 'react';
import Spinner from '@/components/Spinner';
import { FormData } from '@/models/configform';
import Section from '@/components/configform/Section';
import getProjectConfig from '@/utils/configform/getProjectConfig';
import postProjectConfig from '@/utils/configform/postProjectConfig';

const CreateProject: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [apiData, setApiData] = useState<any[]>([]); // Store the original API response

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const data = await getProjectConfig(2); // Fetch project config for major ID 2

      // Map API response to formData
      const initialFormData = data.reduce((acc: Record<string, boolean>, item: any) => {
        acc[item.title] = item.is_active;
        return acc;
      }, {});

      setFormData(initialFormData);
      setApiData(data); // Save the original API data
    } catch (error) {
      console.error('Error fetching data:', error);
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
    const updatedConfigs = apiData.map((item) => ({
      id: item.id,
      is_active: formData[item.title], // Use the updated state
      major_id: item.major_id,
      title: item.title, // Keep the original title from the API response
    }));

    try {
      await postProjectConfig(updatedConfigs); // Post updated config
      alert('Configuration saved successfully!');
    } catch (error) {
      alert('Failed to save configuration. Please try again.');
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
          fields={['title_th', 'title_en', 'abstract_text', 'academic_year', 'semester', 'section_id', 'course_id']}
          formData={formData}
          onToggle={handleToggleChange}
        />

        {/* Section 2: Advisor */}
        <Section
          title="Advisor"
          fields={['advisor']}
          formData={formData}
          onToggle={handleToggleChange}
        />

        {/* Section 3: Committee */}
        <Section
          title="Committee"
          fields={['committee']}
          formData={formData}
          onToggle={handleToggleChange}
        />

        {/* Section 4: Student */}
        <Section
          title="Student"
          fields={['student']}
          formData={formData}
          onToggle={handleToggleChange}
        />

        {/* Section 5: Uploads */}
        <Section
          title="Uploads"
          fields={[
            'report_pdf',
            'poster_picture',
            'presentation_ppt',
            'presentation_pdf',
            'youtube_link',
            'github_link',
            'autocad_file',
            'sketchup_file',
            'optional_link',
          ]}
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
