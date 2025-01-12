import React from 'react';

const Advisors = ({
  formConfig,
  formData,
  onInputChange,
  label,
}: {
  formConfig: any;
  formData: any;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
}) => {
  if (!formConfig['advisor']) return null;

  return (
    <div className="p-4 mb-4 rounded-lg border border-gray-300 bg-white">
      <h6 className="text-lg font-bold mb-4">{label}</h6>
      <input
        type="text"
        name="advisor"
        value={formData.advisor || ''}
        onChange={onInputChange}
        className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-widwa"
        placeholder={`Enter ${label}`}
      />
    </div>
  );
};

export default Advisors;
