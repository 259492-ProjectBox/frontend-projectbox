import { fetchProjectResourceConfigs } from "@/utils/configform/getProjectResourceConfig";
import React, { useState, useEffect } from "react";

// Simple modal component
const Modal: React.FC<{ isOpen: boolean; closeModal: () => void }> = ({ isOpen, closeModal }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h3 className="text-xl font-bold mb-4">Upload Details</h3>

        {/* Section 1: Image Upload */}
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Upload Icon</label>
          <input type="file" className="w-full p-2 border border-gray-300 rounded" />
        </div>

        {/* Section 2: Title Input */}
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Title</label>
          <input type="text" className="w-full p-2 border border-gray-300 rounded" placeholder="Enter title" />
        </div>

        {/* Section 3: Upload Type */}
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Upload Type</label>
          <select className="w-full p-2 border border-gray-300 rounded">
            <option value="image">File</option>
            <option value="link">Link</option>
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
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

const MockTableSection: React.FC = () => {
  const [formData, setFormData] = useState<Record<string, boolean>>({});
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [tableData, setTableData] = useState<any[]>([]); // State to hold fetched table data

  // Fetch data using the controller
  const fetchData = async () => {
    try {
      const data = await fetchProjectResourceConfigs(2); // Fetch data for programId 2
      setTableData(data); // Set table data from API response
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData(); // Fetch data when the component is mounted
  }, []);

  const handleToggleChange = (fieldName: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: !prevData[fieldName],
    }));
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 mb-6 rounded-lg border border-gray-300 bg-white">
      <div className="flex justify-between items-center mb-4">
        <h6 className="text-lg font-bold">Mock Table Section</h6>
        <button
          onClick={openModal}
          className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-700"
        >
          Add Advisor
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3">Picture</th>
              <th scope="col" className="px-4 py-3">Title</th>
              <th scope="col" className="px-4 py-3">Is Active</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((item: any, index: number) => (
              <tr key={index} className="border-b hover:bg-gray-100">
                <td className="px-4 py-3">
                  <img
                    className="w-8 h-8 rounded-full"
                    src={`https://via.placeholder.com/50?text=Image+${index + 1}`} // Placeholder image
                    alt={`Image for ${item.title}`}
                  />
                </td>
                <td className="px-4 py-3">{item.title}</td>
                <td className="px-4 py-3">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={item.is_active || false}
                      onChange={() => handleToggleChange(item.title)}
                    />
                    <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-white peer-checked:bg-green-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} closeModal={closeModal} />
    </div>
  );
};

export default MockTableSection;
