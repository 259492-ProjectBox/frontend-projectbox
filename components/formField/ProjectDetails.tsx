import React from 'react';

const ProjectDetails = ({
  formConfig,
  formData,
  onInputChange,
}: {
  formConfig: any;
  formData: any;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}) => {
  const requiredFields = ['Course', 'ProjectTitle(EN)', 'ProjectTitle(TH)', 'Abstract'];

  return (
    <div className="p-6 mb-6 rounded-lg border border-gray-300 bg-white">
      <h6 className="text-lg font-bold mb-4">Project Details</h6>

      {/* Project Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {['Course', 'Section', 'Semester', 'Academic Year'].map((field) =>
          formConfig[field] && (
            <div key={field}>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                {field}
                {requiredFields.includes(field) && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </label>
              <input
                type="text"
                name={field}
                value={formData[field] || ''}
                onChange={onInputChange}
                className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-widwa"
                placeholder={`Enter ${field}`}
              />
            </div>
          )
        )}
      </div>

      {/* Title Fields */}
      {['ProjectTitle(EN)', 'ProjectTitle(TH)'].map((field) =>
        formConfig[field] && (
          <div key={field} className="mb-6">
            <label className="block mb-1 text-sm font-medium text-gray-700">
              {field.replace('ProjectTitle(EN)', 'Project Title (EN)').replace(
                'ProjectTitle(TH)',
                'Project Title (TH)'
              )}
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              name={field}
              value={formData[field] || ''}
              onChange={onInputChange}
              className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-widwa"
              placeholder={`Enter ${field}`}
            />
          </div>
        )
      )}

      {/* Abstract Field */}
      {formConfig['Abstract'] && (
        <div className="mb-6">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Abstract
            <span className="text-red-500 ml-1">*</span>
          </label>
          <textarea
            name="Abstract"
            value={formData['Abstract'] || ''}
            onChange={onInputChange}
            rows={3}
            className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-widwa resize-y"
            placeholder="Enter Abstract"
          />
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
