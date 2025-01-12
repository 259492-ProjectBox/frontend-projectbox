import React from 'react';

const ProjectDetails = ({
  formConfig,
  formData,
  onInputChange,
  labels,
  requiredFields,
}: {
  formConfig: any;
  formData: any;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  labels: Record<string, string>;
  requiredFields: string[];
}) => {
  return (
    <div className="p-6 mb-6 rounded-lg border border-gray-300 bg-white">
      <h6 className="text-lg font-bold mb-4">Project Details</h6>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Render dynamic fields */}
        {['course_id', 'section_id', 'semester', 'academic_year'].map(
          (field) =>
            formConfig[field] && (
              <div key={field}>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  {labels[field]}{' '}
                  {requiredFields.includes(field) && <span className="text-red-500 ml-1">*</span>}
                </label>
                <input
                  type="text"
                  name={field}
                  value={formData[field] || ''}
                  onChange={onInputChange}
                  className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-widwa"
                  placeholder={`Enter ${labels[field]}`}
                />
              </div>
            )
        )}
      </div>

      {/* Project Title Fields */}
      {['title_en', 'title_th'].map(
        (field) =>
          formConfig[field] && (
            <div key={field} className="mb-6">
              <label className="block mb-1 text-sm font-medium text-gray-700">
                {labels[field]}{' '}
                {requiredFields.includes(field) && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                type="text"
                name={field}
                value={formData[field] || ''}
                onChange={onInputChange}
                className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-widwa"
                placeholder={`Enter ${labels[field]}`}
              />
            </div>
          )
      )}

      {/* Abstract Field */}
      {formConfig['abstract_text'] && (
        <div className="mb-6">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            {labels['abstract_text']}{' '}
            {requiredFields.includes('abstract_text') && <span className="text-red-500 ml-1">*</span>}
          </label>
          <textarea
            name="abstract_text"
            value={formData['abstract_text'] || ''}
            onChange={onInputChange}
            rows={3}
            className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-widwa resize-y"
            placeholder={`Enter ${labels['abstract_text']}`}
          />
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
