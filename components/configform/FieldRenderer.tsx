import React from 'react';

interface FieldRendererProps {
  fields: string[];
  formData: Record<string, boolean>;
  onToggle: (fieldName: string) => void;
}

const FieldRenderer: React.FC<FieldRendererProps> = ({ fields, formData, onToggle }) => {
  return (
    <>
      {fields.map((field) => (
        <div key={field} className="flex items-center justify-between mb-4">
          <label className="text-sm font-medium text-gray-700">
            {field.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())}
          </label>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={formData[field] || false}
              onChange={() => onToggle(field)}
            />
            <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-white peer-checked:bg-green-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
          </label>
        </div>
      ))}
    </>
  );
};

export default FieldRenderer;
