import React from "react";

const CloudUpload = () => {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className="h-8 w-8 text-gray-400 mb-2"
      aria-label="Cloud Upload Icon"
    >
      <title>Upload</title>
      <g fill="none" strokeWidth="2" strokeLinecap="round" stroke="#0C0310">
        {/* Upload arrow */}
        <line x1="12" y1="11" x2="12" y2="20" />
        <path d="M15,13 L12.7071,10.7071 C12.3166,10.3166 11.6834,10.3166 11.2929,10.7071 L9,13" />
        {/* Cloud outline */}
        <path d="M8,16 L6,16 C4.34315,16 3,14.6569 3,13 C3,11.3431 4.34315,10 6,10 C6,6.68629 8.68629,4 12,4 C15.3137,4 18,6.68629 18,10 C19.6569,10 21,11.3431 21,13 C21,14.6569 19.6569,16 18,16 L16,16" />
      </g>
    </svg>
  );
};

export default CloudUpload;
