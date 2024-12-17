import React from 'react';

const CommitteeSelect = ({
  formConfig,
  formData,
  onInputChange,
}: {
  formConfig: any;
  formData: any;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) =>
  formConfig.ProjectAdvisor && (
    <div className="p-4 mb-4 rounded-lg border border-gray-300 bg-white">
      <h6 className="text-lg font-bold mb-4">Advisor(s)</h6>
      <input
        type="text"
        name="ProjectAdvisor"
        value={formData.ProjectAdvisor || ''}
        onChange={onInputChange}
        className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-widwa"
        placeholder="Enter advisors (comma-separated)"
      />
    </div>
  );

export default CommitteeSelect;
