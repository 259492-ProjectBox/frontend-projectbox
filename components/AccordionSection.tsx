import React from "react";

interface AccordionSectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

const AccordionSection: React.FC<AccordionSectionProps> = ({ id, title, children, isOpen, onToggle }) => {
  return (
    <div>
      <h2 id={`accordion-color-heading-${id}`}>
        <button
          type="button"
          className="flex items-center justify-between w-full p-5 font-medium text-gray-500 border border-b-0 border-gray-200 rounded-t-xl focus:ring-4 focus:ring-blue-200 hover:bg-blue-100 gap-3"
          data-accordion-target={`#accordion-color-body-${id}`}
          aria-expanded={isOpen}
          aria-controls={`accordion-color-body-${id}`}
          onClick={onToggle}
        >
          <span>{title}</span>
          <svg
            data-accordion-icon
            className={`w-3 h-3 ${isOpen ? "rotate-180" : ""} shrink-0`}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5 5 1 1 5"
            />
          </svg>
        </button>
      </h2>
      <div
        id={`accordion-color-body-${id}`}
        className={`${isOpen ? "block" : "hidden"} p-5 border border-b-0 border-gray-200`}
      >
        {children}
      </div>
    </div>
  );
};

export default AccordionSection;
