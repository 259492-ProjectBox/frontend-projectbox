import React from 'react';

const FileUploads = ({
  formConfig,
  formData,
  onFileChange,
  labels,
  requiredFields,
}: {
  formConfig: any;
  formData: any;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => void;
  labels: Record<string, string>;
  requiredFields: string[];
}) => {
  const fileFields = [
    'report_pdf',
    'poster_picture',
    'presentation_ppt',
    'presentation_pdf',
    'youtube_link',
    'github_link',
    'optional_link',
    'sketchup_file',
    'autocad_file',
  ];

  return (
    <div className="p-4 mb-4 rounded-lg border border-gray-300 bg-white">
      <h6 className="text-lg font-bold mb-4">Uploads</h6>
      {fileFields.map(
        (field) =>
          formConfig[field] && (
            <div key={field} className="mb-4">
              <label className="block mb-1 text-sm font-medium text-gray-700">
                {labels[field]}{' '}
                {requiredFields.includes(field) && <span className="text-red-500 ml-1">*</span>}
              </label>
              {field.toLowerCase().includes('link') ? (
                <input
                  type="text"
                  name={field}
                  value={formData[field] || ''}
                  onChange={(e) => onFileChange(e as any, field)}
                  className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-widwa"
                  placeholder={`Enter ${labels[field]}`}
                />
              ) : (
                <input
                  type="file"
                  multiple
                  onChange={(e) => onFileChange(e, field)}
                  className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-widwa"
                />
              )}
            </div>
          )
      )}
    </div>
  );
};

export default FileUploads;
