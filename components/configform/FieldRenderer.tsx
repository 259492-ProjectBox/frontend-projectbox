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
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={formData[field] || false}
              onChange={() => onToggle(field)}
            />
            <div className="w-9 h-5 bg-gray-200 rounded-full peer 
                          peer-checked:bg-primary-light peer-focus:ring-2 
                          peer-focus:ring-primary-light/30 
                          after:content-[''] after:absolute after:top-[2px] 
                          after:left-[2px] after:bg-white after:rounded-full 
                          after:h-4 after:w-4 after:transition-all
                          peer-checked:after:translate-x-full"></div>
          </label>
        </div>
      ))}
    </>
  );
};

export default FieldRenderer;
