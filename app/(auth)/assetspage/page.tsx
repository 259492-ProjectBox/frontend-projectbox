"use client"; // Mark this component as a Client Component

import React from "react";

export default function AssetsPage() {
  // Mock data for the assets
  const assets = [
    {
      id: 1,
      title: "Report Template",
      description: "A detailed report template for project documentation.",
      link: "https://example.com/report-template",
    },
    {
      id: 2,
      title: "Course Syllabus",
      description: "Syllabus outline for the engineering course.",
      link: "https://example.com/course-syllabus",
    },
    {
      id: 3,
      title: "Grading Criteria",
      description: "Detailed criteria for project grading.",
      link: "https://example.com/grading-criteria",
    },
  ];

  return (
    <div className="min-h-screen p-4 bg-stone-100">
      {/* First Section */}
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-lg font-semibold text-gray-800 mb-3">Config Assets</h1>
        <p className="text-gray-600 mb-6">
          ฟีเจอร์ที่ใช้สำหรับเก็บรวบรวมทรัพยากรสำคัญ เช่น Report Template, Course Syllabus และเกณฑ์การให้คะแนน 
          เพื่อให้นักศึกษาสามารถนำไปใช้เป็นต้นแบบหรือแนวทางได้อย่างสะดวก
        </p>
      </div>

      {/* Second Section */}
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-xl font-bold text-gray-800 mb-4">Assets Provide</h1>
        <div className="relative overflow-x-auto shadow-md rounded-lg">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700 bg-gray-200">
              <tr>
                <th scope="col" className="px-6 py-3">ID</th>
                <th scope="col" className="px-6 py-3">Title</th>
                <th scope="col" className="px-6 py-3">Description</th>
                <th scope="col" className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset) => (
                <tr
                  key={asset.id}
                  className="bg-white border-b hover:bg-gray-100 transition-all duration-200"
                >
                  <td className="px-6 py-4 font-medium text-gray-700">{asset.id}</td>
                  <td className="px-6 py-4">{asset.title}</td>
                  <td className="px-6 py-4">{asset.description}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <a
                      href={asset.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#A71919] hover:underline"
                    >
                      Open Link
                    </a>
                    <button
                      className="text-[#A71919] hover:underline"
                      // onClick={() => console.log(`Downloading file from: ${asset.link}`)}
                    >
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
