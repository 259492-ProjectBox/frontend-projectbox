"use client"
import CloudUpload from "@/public/Svg/CloudUpload";
import React, { useState } from "react";

export default function ConfigProgram() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploadMode, setIsUploadMode] = useState(true); // Toggle between Upload and Paste Link modes

  const handleUpload = () => {
    console.log("File uploaded!");
    setIsModalOpen(false);
  };

  const handlePasteLink = () => {
    console.log("Link submitted!");
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      {/* Section 1 */}
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-4">
        <h1 className="text-lg font-semibold text-gray-800 mb-3">Config Program</h1>
        <p className="text-gray-600 mb-6">
          ฟีเจอร์ที่ใช้สำหรับเก็บรวบรวมทรัพยากรสำคัญ เช่น Report Template, Course Syllabus และเกณฑ์การให้คะแนน 
          เพื่อให้นักศึกษาสามารถนำไปใช้เป็นต้นแบบหรือแนวทางได้อย่างสะดวกfffff
        </p>
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
                {/* Upload File Section */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center mb-4">
                  <CloudUpload />
                  <p className="text-gray-500 mb-2">Drag & Drop files here</p>
                  <button
                    className="text-[#A71919] hover:underline"
                    onClick={() => console.log("Browse files clicked")}
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
                {/* Paste Link Section */}
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
