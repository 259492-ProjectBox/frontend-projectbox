import React from 'react';

const FileUpload = ({
  formConfig,
  onFileChange,
}: {
  formConfig: any;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => void;
}) => (
  <div className="p-4 mb-4 rounded-lg border border-gray-300 bg-white">
          <h6 className="text-lg font-bold mb-4">Upload(s)</h6>

    {['Poster', 'Draft Report', 'Final Report', 'Final Presentation'].map(
      field =>
        formConfig[field] && (
          <div key={field} className="mb-4">
            <label className="block mb-1 text-sm font-medium text-gray-700">{field}</label>
            <input
              type="file"
              multiple
              onChange={e => onFileChange(e, field)}
              className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-widwa"
            />
          </div>
        )
    )}
  </div>
);

export default FileUpload;
