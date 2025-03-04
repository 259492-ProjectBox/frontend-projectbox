import React from "react";

interface ExcelTemplateSectionProps {
  title: string;
  templateUrl: string;
}

const ExcelTemplateSection: React.FC<ExcelTemplateSectionProps> = ({ title, templateUrl }) => {
  return (
    <div className="">
      <a
        href={templateUrl}
        download
        className="text-blue-600 hover:underline"
      >
        Download {title}
      </a>
    </div>
  );
};

export default ExcelTemplateSection;
