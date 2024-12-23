"use client";
import React from "react";

interface DetailedSearchControlsProps {
  searchFields: {
    courseNo: string;
    projectTitle: string;
    studentNo: string;
    advisorName: string;
    committeeName: string;
  };
  setSearchFields: (fields: any) => void;
  handleSearch: () => void;
}

const DetailedSearchControls: React.FC<DetailedSearchControlsProps> = ({
  searchFields,
  setSearchFields,
  handleSearch,
}) => {
  return (
    <div className="bg-white rounded-lg p-3 shadow mb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {[
          {
            label: "Course No.",
            placeholder: "e.g. 261492",
            value: searchFields.courseNo,
            key: "courseNo",
          },
          {
            label: "Project Title (EN or TH)",
            placeholder: "e.g. Project Box",
            value: searchFields.projectTitle,
            key: "projectTitle",
          },
          {
            label: "Student No.",
            placeholder: "e.g. 640610633",
            value: searchFields.studentNo,
            key: "studentNo",
          },
          {
            label: "Advisor Name (EN or TH)",
            placeholder: "e.g. Pichayoot Hunchainao",
            value: searchFields.advisorName,
            key: "advisorName",
          },
          {
            label: "Committee Name (EN or TH)",
            placeholder: "e.g. Dome Potikanond",
            value: searchFields.committeeName,
            key: "committeeName",
          },
        ].map(({ label, placeholder, value, key }) => (
          <div key={key} className="mb-2">
            <label className="block mb-1 text-teal-800 text-xs font-medium">
              {label}
            </label>
            <input
              type="text"
              placeholder={placeholder}
              value={value}
              onChange={(e) =>
                setSearchFields({ ...searchFields, [key]: e.target.value })
              }
              className="w-full p-1.5 border border-gray-300 rounded focus:outline-none focus:border-teal-500 text-sm"
            />
          </div>
        ))}
      </div>
      <div className="flex justify-end mt-4">
        <button
          onClick={handleSearch}
          className="bg-teal-500 text-white py-1.5 px-6 rounded-md hover:bg-teal-600 focus:outline-none focus:bg-teal-700 text-sm"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default DetailedSearchControls;
