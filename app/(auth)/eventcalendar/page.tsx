import React from "react";

export default function EventCalendarPage() {
  return (
    <div className="min-h-screen p-4 bg-stone-100">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-xl font-bold text-gray-800 mb-4">Event Calendar</h1>
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">September</h2>
            <div className="flex items-center mb-3">
              <div className="bg-red-300 text-red-800 px-3 py-1 rounded-lg text-sm font-semibold mr-4">
                20/9/2024
              </div>
              <p className="text-gray-700">Project Brief ว่าจะทำอะไร Project เป็นรูปแบบไหน</p>
            </div>
            <div className="flex items-center">
              <div className="bg-red-300 text-red-800 px-3 py-1 rounded-lg text-sm font-semibold mr-4">
                20/9/2024
              </div>
              <p className="text-gray-700">Project Brief ว่าจะทำอะไร Project เป็นรูปแบบไหน</p>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">October</h2>
            <div className="flex items-center mb-3">
              <div className="bg-blue-300 text-blue-800 px-3 py-1 rounded-lg text-sm font-semibold mr-4">
                20/10/2024
              </div>
              <p className="text-gray-700">
                วันสุดท้ายของ หัวข้อโปรเจค ถ้าไม่ได้หัวข้อวันนี้นี้ ไปทำปีหน้าเลยนะ เพราะจะปิดรับหัวข้อแล้ว อยากรอครับละ
              </p>
            </div>
            <div className="flex items-center">
              <div className="bg-blue-300 text-blue-800 px-3 py-1 rounded-lg text-sm font-semibold mr-4">
                20/10/2024
              </div>
              <p className="text-gray-700">Project Brief ว่าจะทำอะไร Project เป็นรูปแบบไหน</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}