import React from 'react';

const Students = ({
  formConfig,
  formData,
  onInputChange,
  label,
  required,
}: {
  formConfig: any;
  formData: any;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  required?: boolean;
}) => {
  if (!formConfig['student']) return null;

  return (
    <div className="p-4 mb-4 rounded-lg border border-gray-300 bg-white">
      <h6 className="text-lg font-bold mb-4">{label}</h6>
      <input
        type="text"
        name="student"
        value={formData.student || ''}
        onChange={onInputChange}
        className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-widwa"
        placeholder={`Enter ${label}`}
      />
      {required && <span className="text-red-500 text-sm">* Required</span>}
    </div>
  );
};

export default Students;
