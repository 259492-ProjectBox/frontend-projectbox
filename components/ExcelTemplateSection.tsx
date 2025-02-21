import React from "react";

interface ExcelTemplateSectionProps {
  title: string;
  templateUrl: string;
}

const ExcelTemplateSection: React.FC<ExcelTemplateSectionProps> = ({ title, templateUrl }) => {
  return (
    <div className="">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      <a
        href={templateUrl}
        download
        className="text-blue-600 hover:underline"
      >
        Download Example Template
      </a>
    </div>
  );
};

export default ExcelTemplateSection;
