import React from 'react';
import FieldRenderer from './FieldRenderer';

interface SectionProps {
  title: string;
  fields: string[];
  formData: Record<string, boolean>;
  onToggle: (fieldName: string) => void;
}

const Section: React.FC<SectionProps> = ({ title, fields, formData, onToggle }) => {
  return (
    <div className="p-6 mb-6 rounded-lg border border-gray-300 bg-white">
      <h6 className="text-lg font-bold mb-4">{title}</h6>
      <FieldRenderer fields={fields} formData={formData} onToggle={onToggle} />
    </div>
  );
};

export default Section;
