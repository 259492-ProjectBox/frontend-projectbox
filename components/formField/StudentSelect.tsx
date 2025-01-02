import React from 'react';

const StudentSelect = ({
  formConfig,
  formData,
  onInputChange,
}: {
  formConfig: any;
  formData: any;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) =>
  formConfig.Student && (
    <div className="p-4 mb-4 rounded-lg border border-gray-300 bg-white">
      <h6 className="text-lg font-bold mb-4">Student(s)</h6>
      <input
        type="text"
        name="Student"
        value={formData.Student || ''}
        onChange={onInputChange}
        className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-widwa"
        placeholder="Enter student IDs (comma-separated)"
      />
    </div>
  );

export default StudentSelect;
