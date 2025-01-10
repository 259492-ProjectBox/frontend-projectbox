import React from "react";

export default function AssetsPage() {
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
        <div className="space-y-6">
          {/* Content for the second section */}
          <p className="text-gray-600">
            This section can include additional details, resources, or any other information related to the assets.
          </p>
        </div>
      </div>
    </div>
  );
}
