"use client";
import React, { useEffect, useState } from "react";
import Spinner from "@/components/Spinner";
import { ConfigProgramSetting } from "@/models/ConfigProgram";
import { useConfigProgram } from "@/utils/configprogram/configProgram";
import getAllProgram from "@/utils/getAllProgram";
import { AllProgram } from "@/models/AllPrograms";

export default function ConfigProgram() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Local states for semester & academic year
  const [semester, setSemester] = useState<string>("1");
  const [academicYear, setAcademicYear] = useState<string>("2025");

  // Program data
  const [programData, setProgramData] = useState<AllProgram[]>([]);
  const [selectedMajor, setSelectedMajor] = useState<number>(0); // Program ID currently chosen
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Config data from custom hook
  const configData = useConfigProgram(); 

  // 1) Fetch list of all programs (for dropdown)
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const programs = await getAllProgram();
        setProgramData(programs);

        // Optional: set a default selection if needed
        if (programs.length > 0) {
          setSelectedMajor(programs[0].id);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load program data.");
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  // 2) Filter configData so we only show settings matching selectedMajor
  const filteredConfigData = configData.filter(
    (config) => config.program_id === selectedMajor
  );

  // 3) Find the selected program object to display its name
  const selectedProgram = programData.find(
    (program) => program.id === selectedMajor
  );

  // Handler for saving changes in edit mode
  const handleSave = () => {
    console.log("Saved values - Academic Year:", academicYear, "Semester:", semester);
    setIsEditMode(false); // Turn off edit mode
  };

  // Show loading or error
  if (loading) return <Spinner />;
  if (error) {
    return (
      <div className="min-h-screen p-4 bg-gray-100 flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow p-6">

        {/* Program Selector */}
        <div className="mb-5 p-4 rounded-md shadow-sm border border-gray-200 bg-white">
          <label
            htmlFor="programSelect"
            className="block mb-2 text-sm font-semibold text-gray-700"
          >
            Program:
          </label>
          <select
            id="programSelect"
            value={selectedMajor}
            onChange={(e) => setSelectedMajor(Number(e.target.value))}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded
                       focus:outline-none focus:ring-2 focus:ring-red-900"
          >
            {programData.map((prog) => (
              <option key={prog.id} value={prog.id}>
                {prog.program_name_en}
              </option>
            ))}
          </select>
        </div>

        {/* Program Name */}
        <h2 className="text-lg font-semibold text-gray-800 mt-6">
          {selectedProgram?.program_name_en ?? "No program selected"}
        </h2>

        {/* Config Data Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          {filteredConfigData.length > 0 ? (
            filteredConfigData.map((item: ConfigProgramSetting, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-gray-800 font-semibold">{item.config_name}</h2>

                {/* Toggling read-only vs. edit mode for specific items */}
                {item.config_name === "semester" ? (
                  isEditMode ? (
                    <select
                      value={semester}
                      onChange={(e) => setSemester(e.target.value)}
                      className="mt-2 p-2 border border-gray-300 rounded"
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3 (Summer)</option>
                    </select>
                  ) : (
                    <p className="text-gray-600 mt-2">{semester}</p>
                  )
                ) : item.config_name === "academic year" ? (
                  isEditMode ? (
                    <input
                      type="text"
                      value={academicYear}
                      onChange={(e) => setAcademicYear(e.target.value)}
                      className="mt-2 p-2 border border-gray-300 rounded"
                    />
                  ) : (
                    <p className="text-gray-600 mt-2">{academicYear}</p>
                  )
                ) : (
                  <p className="text-gray-600 mt-2">{item.value}</p>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-600">
              No configuration data found for this program.
            </p>
          )}
        </div>

        {/* Edit/Save Buttons */}
        <div className="mt-4">
          <button
            onClick={() => setIsEditMode((prev) => !prev)}
            className="text-white bg-blue-900 py-2 px-4 rounded-lg 
                       hover:bg-blue-800 transition-colors"
          >
            {isEditMode ? "Cancel" : "Edit"}
          </button>
          {isEditMode && (
            <button
              onClick={handleSave}
              className="ml-4 text-white bg-blue-900 py-2 px-4 rounded-lg 
                         hover:bg-blue-800 transition-colors"
            >
              Save
            </button>
          )}
        </div>
      </div>

      {/* Example Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center 
                        bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h2 className="text-lg font-semibold mb-4">Add Asset</h2>
            <div className="flex justify-between mb-4">
              <button
                className="w-1/2 text-center py-2 rounded-lg bg-blue-900 text-white 
                           hover:bg-blue-800 transition-colors"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
