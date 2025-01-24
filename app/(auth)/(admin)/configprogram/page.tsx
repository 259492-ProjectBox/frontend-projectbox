"use client"
import { ConfigProgramSetting } from "@/models/ConfigProgram";
import { useConfigProgram } from "@/utils/configprogram/configProgram";
import getAllProgram from "@/utils/getAllProgram"; // Import the function
import React, { useState, useEffect } from "react";

export default function ConfigProgram() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // State to toggle edit mode
  const [semester, setSemester] = useState<string>("1"); // State for the selected semester
  const [academicYear, setAcademicYear] = useState<string>("2025"); // State for academic year
  const configData = useConfigProgram(); // Use the hook to fetch config data
  
  const [programData, setProgramData] = useState<any[]>([]); // Initialize programData state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch program data on component mount
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const programs = await getAllProgram();  // Call the async getAllProgram function
        setProgramData(programs);  // Set the fetched programs to state
        setLoading(false);  // Set loading to false once data is fetched
      } catch (err) {
        setError("Failed to load program data.");  // Set error if something goes wrong
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []); // Empty dependency array means this runs only once when the component mounts

  // Filter program data to only include the current program
  const filteredProgram = programData.filter(program =>
    configData.some(config => config.program_id === program.id)
  );

  const handleSave = () => {
    // Here, you can handle the logic to save the updated values
    console.log("Saved values - Academic Year:", academicYear, "Semester:", semester);

    // After saving, you can toggle off the edit mode
    setIsEditMode(false);
  };

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      {/* Displaying Program Name and Description Above Config Data */}
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-4">
        <h2 className="text-lg font-semibold text-gray-800 mt-6">{filteredProgram[0]?.program_name_en}</h2> {/* Program Name */}
        <p className="text-gray-600">{filteredProgram[0]?.description}</p> {/* Program Description */}

        {/* Displaying Config Data (Semester, Academic Year) in 2 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          {configData.length > 0 ? (
            configData.map((item: ConfigProgramSetting, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-gray-800 font-semibold">{item.config_name}</h2>
                {isEditMode && item.config_name === "semester" ? (
                  // Displaying input field for semester if in edit mode
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="mt-2 p-2 border border-gray-300 rounded"
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3 (Summer)</option>
                  </select>
                ) : item.config_name === "semester" ? (
                  <p className="text-gray-600">{semester}</p>
                ) : item.config_name === "academic year" ? (
                  isEditMode ? (
                    <input
                      type="text"
                      value={academicYear}
                      onChange={(e) => setAcademicYear(e.target.value)}
                      className="mt-2 p-2 border border-gray-300 rounded"
                    />
                  ) : (
                    <p className="text-gray-600">{academicYear}</p>
                  )
                ) : (
                  <p className="text-gray-600">{item.value}</p>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-600">Loading config data...</p>
          )}
        </div>

        {/* Button to toggle edit mode */}
        <div className="mt-4">
          <button
            onClick={() => setIsEditMode((prev) => !prev)}
            className="text-white bg-[#A71919] py-2 px-4 rounded-lg hover:bg-[#7F1313]"
          >
            {isEditMode ? "Cancel" : "Edit"}
          </button>
          {isEditMode && (
            <button
              onClick={handleSave}
              className="ml-4 text-white bg-green-600 py-2 px-4 rounded-lg hover:bg-green-500"
            >
              Save
            </button>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h2 className="text-lg font-semibold mb-4">Add Asset</h2>
            <div className="flex justify-between mb-4">
              <button
                className={`w-1/2 text-center py-2 rounded-lg bg-[#A71919] text-white`}
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
