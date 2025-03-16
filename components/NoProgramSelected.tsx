import React from "react";
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

export default function NoProgramSelected() {
  return (
    <div className="min-h-screen bg-gray-50/50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-8 text-center">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center">
              <WarningAmberIcon className="w-8 h-8 text-amber-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">No Program Selected</h2>
            <p className="text-gray-600 max-w-md">
              Please select a program from the dropdown in the navigation bar to view and Manage program settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
