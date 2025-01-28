import { fetchProjectResourceConfigs } from "@/utils/configform/getProjectResourceConfig";
import updateResourceStatus from "@/utils/configform/updateProjectResourceConfig";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { ProjectResourceConfig } from "@/models/ProjectRespurceConfig";

// API controller for creating a project resource
const createProjectResource = async (data: {
  icon_name: string;
  is_active: boolean;
  program_id: number;
  resource_type_id: number;
  title: string;
}) => {
  const API_URL =
    "https://project-service.kunmhing.me/api/v1/projectResourceConfigs";
  try {
    const response = await axios.put(API_URL, data, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating project resource:", error);
    throw error;
  }
};

const UploadResourceSection: React.FC = () => {
  // const [formData, setFormData] = useState<Record<string, boolean>>({});
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [tableData, setTableData] = useState<ProjectResourceConfig[]>([]); // Replace with ProjectResourceConfig[]
  // State to hold fetched table data

  const [iconName, setIconName] = useState(""); // State for icon name
  const [resourceTypeId, setResourceTypeId] = useState(1); // Set to 1 by default for File resource type
  const [title, setTitle] = useState(""); // State for title

  // Fetch data using the controller
  const fetchData = async () => {
    try {
      const data = await fetchProjectResourceConfigs(1); // Fetch data for programId 2
      setTableData(data); // Set table data from API response
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData(); // Fetch data when the component is mounted
  }, []);

  const handleToggleChange = async (item: ProjectResourceConfig) => {
    const updatedStatus = !item.is_active;
  
    const updatedData: ProjectResourceConfig = {
      ...item,
      is_active: updatedStatus,
    };
  
    try {
      await updateResourceStatus(updatedData);
      setTableData((prevData) =>
        prevData.map((dataItem) =>
          dataItem.id === item.id
            ? { ...dataItem, is_active: updatedStatus }
            : dataItem
        )
      );
    } catch (error) {
      console.error("Error updating resource status:", error);
    }
  };
  

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Get the first selected file
    if (file) {
      setIconName(file.name); // Extract file name and set it to state
    }
  };

  const handleSubmit = async () => {
    const data = {
      icon_name: iconName, // Send only the file name
      is_active: true, // Assuming the resource is active by default
      program_id: 2, // Assuming program ID 2
      resource_type_id: resourceTypeId,
      title: title,
    };

    try {
      await createProjectResource(data); // Send data to the API
      alert("Project resource created successfully!");
      closeModal(); // Close the modal after successful creation
      fetchData(); // Refresh table data after creation
    } catch (error) {
      console.log(error);
      alert("Failed to create project resource. Please try again.");
    }
  };

  return (
    <div className="p-6 mb-6 rounded-lg border border-gray-300 bg-white">
      <div className="flex justify-between items-center mb-4">
        <h6 className="text-lg font-bold">Upload Resource Section</h6>
        <button
          onClick={openModal}
          className="bg-primary_button text-white py-1 px-3 rounded hover:bg-button_hover"
        >
          Add Upload Type
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3">
                Icon
              </th>
              <th scope="col" className="px-4 py-3">
                Title
              </th>
              <th scope="col" className="px-4 py-3">
                Is Active
              </th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((item: ProjectResourceConfig, index: number) => (
              <tr key={index} className="border-b hover:bg-gray-100">
                <td className="px-4 py-3">
                  <Image
                    className="w-8 h-8 rounded-full"
                    src="/logo-engcmu/CMU_LOGO_Crop.jpg"
                    alt={""}
                    width={32} // Specify width (in px)
                    height={32} // Specify height (in px)
                  />
                </td>
                <td className="px-4 py-3">{item.title}</td>
                <td className="px-4 py-3">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={item.is_active || false}
                      onChange={() => handleToggleChange(item)} // Pass the item object to the handler
                    />
                    <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-white peer-checked:bg-green-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for creating new project resource */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-bold mb-4">Upload Details</h3>

            {/* Section 1: Icon Upload */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">
                Upload Icon
              </label>
              <input
                type="file"
                className="w-full p-2 border border-gray-300 rounded"
                onChange={handleIconChange}
              />
            </div>

            {/* Section 2: Title Input */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Title</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Section 3: Upload Type */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">
                Upload Type
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded"
                value={resourceTypeId}
                onChange={(e) => setResourceTypeId(Number(e.target.value))}
              >
                <option value="1">File</option>
                <option value="2">Link</option>
              </select>
            </div>

            {/* Modal buttons */}
            <div className="flex justify-end">
              <button
                onClick={closeModal}
                className="bg-gray-300 text-black px-4 py-2 rounded mr-2 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadResourceSection;
