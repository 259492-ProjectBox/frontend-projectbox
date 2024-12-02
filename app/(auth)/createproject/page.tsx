'use client';
import React from 'react';

const CreateProject: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-stone-100 py-6">
      <div className="container mx-auto max-w-3xl">
        <h6 className="mb-4 text-lg font-bold">Create Project</h6>

        {/* Project Detail Section */}
        <div className="p-6 mb-6 rounded-lg border border-gray-300 bg-white">
          <div className="border-l-4 border-widwa pl-4 mb-6">
            <h6 className="text-lg">Project Detail</h6>
          </div>

          {/* Department Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Course</label>
              <select className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-widwa">
                <option>Select</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Section</label>
              <input
                type="text"
                className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-widwa"
                placeholder="Enter section"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">เทอม</label>
              <select className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-widwa">
                <option>Select</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">ปีการศึกษา</label>
              <select className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-widwa">
                <option>Select</option>
              </select>
            </div>
          </div>

          {/* Project Title Fields */}
          <div className="flex flex-col gap-4 mb-6">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Project Title (EN) <span className="text-red-500">*</span>
              </label>
              <input className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-widwa" />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Project Title (TH) <span className="text-red-500">*</span>
              </label>
              <input className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-widwa" />
            </div>
          </div>

          {/* Project Abstract Fields */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Abstract</label>
            <textarea
              className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-widwa"
              rows={4}
              placeholder="Enter abstract"
            />
          </div>
        </div>

        {/* Project Advisor Section */}
        <div className="p-4 mb-4 rounded-lg border border-gray-300 bg-white">
          <div className="border-l-4 border-widwa pl-3 mb-4">
            <h6 className="text-base">Project Advisor</h6>
          </div>
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium">Add Advisor</label>
            <div className="flex gap-3">
              <input
                className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-widwa"
                placeholder="Advisor ID or Name"
              />
              <button className="p-2 bg-teal-500 text-white text-sm rounded-md hover:bg-teal-700">Add</button>
            </div>
          </div>
        </div>

        {/* Student(s) Section */}
        <div className="p-4 mb-4 rounded-lg border border-gray-300 bg-white">
          <div className="border-l-4 border-widwa pl-3 mb-4">
            <h6 className="text-base">Student(s)</h6>
          </div>
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium">Add Student</label>
            <div className="flex gap-3">
              <input
                className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-widwa"
                placeholder="Student ID e.g. 6x0123456"
              />
              <button className="p-2 bg-teal-500 text-white text-sm rounded-md hover:bg-teal-700">Add</button>
            </div>
          </div>
        </div>

        {/* Files Section */}
        <div className="p-4 mb-4 rounded-lg border border-gray-300 bg-white">
          <div className="border-l-4 border-widwa pl-3 mb-4">
            <h6 className="text-base">File(s)</h6>
          </div>
          {/* File Upload Fields */}
          {['Poster', 'Draft Report', 'Final Report', 'Final Presentation'].map((label, index) => (
            <div key={index} className="mb-4">
              <label className="block mb-1 text-sm font-medium text-gray-700">
                {label} <span className="text-red-500">(max 25 MB)</span>
              </label>
              <input
                type="file"
                className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-widwa"
              />
            </div>
          ))}
          {/* Link Embed Fields */}
          {['YouTube', 'GitHub Repo'].map((label, index) => (
            <div key={index} className="mb-4">
              <label className="block mb-1 text-sm font-medium text-gray-700">{label} Link</label>
              <input
                type="url"
                className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-widwa"
                placeholder={`Enter ${label} link`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreateProject;
