"use client";
import CloudUpload from "@/public/Svg/CloudUpload";
import React, { useState } from "react";

export default function ConfigAssets() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploadMode, setIsUploadMode] = useState(true);

  const handleUpload = () => {
    // console.log("File uploaded!");
    setIsModalOpen(false);
  };

  const handlePasteLink = () => {
    // console.log("Link submitted!");
    setIsModalOpen(false);
  };

  // Mock data for the table
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
    <div className="min-h-screen p-4 bg-gray-100">
      {/* Section 1 */}
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-4">
        <h1 className="text-lg font-semibold text-gray-800 mb-3">Config Assets</h1>
        <p className="text-gray-600 mb-6">
          ฟีเจอร์ที่ใช้สำหรับเก็บรวบรวมทรัพยากรสำคัญ เช่น Report Template, Course Syllabus และเกณฑ์การให้คะแนน 
          เพื่อให้นักศึกษาสามารถนำไปใช้เป็นต้นแบบหรือแนวทางได้อย่างสะดวก
        </p>
      </div>

      {/* Section 2 */}
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-4 mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Assets Table</h2>
          <button
            className="text-white bg-[#A71919] hover:bg-[#7F1313] focus:ring-4 focus:ring-[#A71919]/50 font-medium rounded-lg text-sm px-4 py-2"
            onClick={() => setIsModalOpen(true)}
          >
            Add New Asset
          </button>
        </div>
        <div className="relative overflow-x-auto shadow-md rounded-lg">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700 bg-gray-200">
              <tr>
                <th scope="col" className="px-6 py-3">
                  ID
                </th>
                <th scope="col" className="px-6 py-3">
                  Title
                </th>
                <th scope="col" className="px-6 py-3">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-right">
                  Action
                </th>
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h2 className="text-lg font-semibold mb-4">Add Asset</h2>
            <div className="flex justify-between mb-4">
              <button
                className={`w-1/2 text-center py-2 rounded-lg ${
                  isUploadMode
                    ? "bg-[#A71919] text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
                onClick={() => setIsUploadMode(true)}
              >
                Upload File
              </button>
              <button
                className={`w-1/2 text-center py-2 rounded-lg ${
                  !isUploadMode
                    ? "bg-[#A71919] text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
                onClick={() => setIsUploadMode(false)}
              >
                Paste Link
              </button>
            </div>

            {isUploadMode ? (
              <div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center mb-4">
                  <CloudUpload />
                  <p className="text-gray-500 mb-2">Drag & Drop files here</p>
                  <button
                    className="text-[#A71919] hover:underline"
                    // onClick={() => console.log("Browse files clicked")}
                  >
                    Browse Files
                  </button>
                </div>
                <textarea
                  className="w-full border border-gray-300 rounded-lg p-2 mb-4"
                  placeholder="Description"
                  rows={3}
                ></textarea>
                <div className="flex justify-end gap-2">
                  <button
                    className="text-gray-600 bg-white border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-100"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="text-white bg-[#A71919] hover:bg-[#7F1313] rounded-lg px-4 py-2"
                    onClick={handleUpload}
                  >
                    Upload
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg p-2 mb-4"
                  placeholder="Paste your link here"
                />
                <textarea
                  className="w-full border border-gray-300 rounded-lg p-2 mb-4"
                  placeholder="Description"
                  rows={3}
                ></textarea>
                <div className="flex justify-end gap-2">
                  <button
                    className="text-gray-600 bg-white border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-100"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="text-white bg-[#A71919] hover:bg-[#7F1313] rounded-lg px-4 py-2"
                    onClick={handlePasteLink}
                  >
                    Submit
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
