"use client";
import React, { useEffect, useState } from "react";
import Spinner from "@/components/Spinner";
import { FormData } from "@/models/configform";
import Section from "@/components/configform/Section";
import getProjectConfig from "@/utils/configform/getProjectConfig";
import updateProjectConfigs from "@/utils/configform/updateProjectConfigs";
import { ProjectConfig } from "@/models/ProjectConfig";
import { useAuth } from "@/hooks/useAuth";
import { AllProgram } from "@/models/AllPrograms";
import { getProgramOptions } from "@/utils/programHelpers";
import { getProjectResourceConfig } from "@/utils/configform/getProjectResourceConfig";
import updateResourceStatus from "@/utils/configform/updateProjectResourceConfig";
import Image from "next/image";
import { ProjectResourceConfig } from "@/models/ProjectRespurceConfig";
import createProjectResource from "@/utils/configform/createProjectResource";

const ConfigSubmission: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [apiData, setApiData] = useState<ProjectConfig[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [tableData, setTableData] = useState<ProjectResourceConfig[]>([]);
  const [iconName, setIconName] = useState("");
  const [resourceTypeId, setResourceTypeId] = useState(1);
  const [title, setTitle] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false); // State for edit modal visibility
  const [resourceToEdit, setResourceToEdit] = useState<ProjectResourceConfig | null>(null); // Resource to be edited
  const [editIconName, setEditIconName] = useState<string>(""); // State for edit icon name
  const [editTitle, setEditTitle] = useState<string>(""); // State for edit title
  const [editResourceTypeId, setEditResourceTypeId] = useState<number>(1); // State for edit resource type ID

  // Major selector states (for display only; not filtering data)
  const { user } = useAuth();
  const [selectedMajor, setSelectedMajor] = useState<number>(0); 
  const [options, setOptions] = useState<AllProgram[]>([]);
  
  useEffect(() => {
    const fetchOptions = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const programOptions = await getProgramOptions(user.isAdmin);
        setOptions(programOptions);

        // Ensure selectedMajor is in options; otherwise, reset to default (0)
        if (!programOptions.some((option) => option.id === selectedMajor)) {
          setSelectedMajor(0);
        }
      } catch (err) {
        console.error("Error fetching program options:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, [user, selectedMajor]); // Re-fetch when `user` or `selectedMajor` changes

  
  const fetchData = async () => {
    try {
      if(selectedMajor === 0) return setTableData([]);
      const data = await getProjectResourceConfig(selectedMajor);
      
      setTableData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setLoading(true);
        
        if (selectedMajor === 0) {

          setFormData({});
          setApiData([]);
          setLoading(false);
          return;
        }
        const data: ProjectConfig[] = await getProjectConfig(selectedMajor);
        
        const initialFormData = data.reduce(
          (acc: Record<string, boolean>, item: ProjectConfig) => {
            acc[item.title] = item.is_active;
            return acc;
          },
          {}
        );
        setFormData(initialFormData);
        setApiData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

      fetchConfig() 
      fetchData();
  }, [selectedMajor]);

  useEffect(() => {
    fetchData();
  }, [fetchData]); // Include 'fetchData' in the dependency array

  const handleToggleChange = (fieldName: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: !prevData[fieldName],
    }));
  };

  const handleSubmit = async () => {
    const updatedConfigs: ProjectConfig[] = apiData.map((item) => ({
      id: item.id,
      is_active: formData[item.title],
      program_id: item.program_id,
      title: item.title,
      imageUrl: "",
    }));

    try {
      await updateProjectConfigs(updatedConfigs);
      alert("Configuration updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to update configuration. Please try again.");
    }
  };

  

  // useEffect(() => {
  //   fetchData();
  // }, [selectedMajor]);

  const handleResourceToggleChange = async (item: ProjectResourceConfig) => {
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
    const file = e.target.files?.[0];
    if (file) {
      setIconName(file.name);
    }
  };

  const handleResourceSubmit = async () => {
    const data = {
      icon_name: iconName,
      is_active: true,
      program_id: selectedMajor,
      resource_type_id: resourceTypeId,
      title: title,
    };

    try {
      await createProjectResource(data);
      alert("Project resource created successfully!");
      closeModal();
      fetchData();
    } catch (error) {
      console.log(error);
      alert("Failed to create project resource. Please try again.");
    }
  };

  const openEditModal = (resource: ProjectResourceConfig) => {
    setResourceToEdit(resource);
    setEditIconName(resource.icon_name);
    setEditTitle(resource.title);
    setEditResourceTypeId(resource.resource_type_id); // Correctly set resource type ID
    setIsEditModalOpen(true);
  };
  
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setResourceToEdit(null);
  };
  
  const handleEditResourceSubmit = async () => {
    if (resourceToEdit) {
      const updatedResource = {
        ...resourceToEdit,
        icon_name: editIconName,
        title: editTitle,
        resource_type_id: editResourceTypeId,
      };
  
      try {
        await updateResourceStatus(updatedResource);
        alert("Resource updated successfully!");
        closeEditModal();
        fetchData();
      } catch (error) {
        console.log(error);
        alert("Failed to update resource. Please try again.");
      }
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="flex flex-col min-h-screen bg-stone-100 py-6">
      <div className="container mx-auto max-w-5xl">
        
        {/* Major Selector Container */}
        <div className="mb-5 p-4 rounded-md shadow-sm border border-gray-200 bg-white">
          <label
            htmlFor="majorSelect"
            className="block mb-2 text-sm font-semibold text-gray-700"
          >
            Program:
          </label>
          <select
            id="majorSelect"
            value={selectedMajor}
            onChange={(e) => setSelectedMajor(Number(e.target.value))}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded 
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {options.map((option) => (
              <option key={option.id} value={option.id}>
                {option.program_name_en}
              </option>
            ))}
          </select>
        </div>

        {/* Hide content if no program is selected */}
        {selectedMajor !== 0 && (
          <>
            {/* Page Heading */}
            <h2 className="mb-4 text-xl font-bold text-gray-800">
              Create Project Form
            </h2>

            {/* Single Container for BOTH sections + Save Button */}
            <div className="p-6 bg-white border border-gray-200 rounded-md shadow-sm mb-6">
              {/* 2-column layout for Project Details & Members */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column: Project Details */}
                <Section
                  title="Project Details"
                  fields={[
                    "title_th",
                    "title_en",
                    "abstract_text",
                    "academic_year",
                    "semester",
                    "section_id",
                    "course_id",
                  ]}
                  formData={formData}
                  onToggle={handleToggleChange}
                />

                {/* Right Column: Members */}
                <Section
                  title="Members"
                  fields={[
                    "advisor",
                    "co_advisor",
                    "external_committee",
                    "committee",
                    "student",
                  ]}
                  formData={formData}
                  onToggle={handleToggleChange}
                />
              </div>

              {/* Save Button aligned to the right */}
              <div className="flex justify-end">
                <button
                  onClick={handleSubmit}
                  className="bg-primary_button text-white py-1 px-3 rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </div>

            {/* Mock Table Section (Upload Resource) */}
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
                        Type
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Is Active
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((item: ProjectResourceConfig, index: number) => (
                      <tr key={index} className="border-b hover:bg-gray-100">
                        <td className="px-4 py-3">
                          {item.icon_name ? (
                            <Image
                              className="w-8 h-8 rounded-full"
                              src="/IconProjectBox/BlueBox.png"
                              alt={""}
                              width={32}
                              height={32}
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                              N/A
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">{item.title}</td>
                        <td className="px-4 py-3">{item.resource_type_id === 1 ? "File" : "Link"}</td>
                        <td className="px-4 py-3">
                          <label className="inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={item.is_active || false}
                              onChange={() => handleResourceToggleChange(item)}
                            />
                            <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-white peer-checked:bg-green-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                          </label>
                        </td>
                        <td className="px-4 py-3 font-medium text-blue-600 cursor-pointer" onClick={() => openEditModal(item)}>
                          Edit
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
                        onClick={handleResourceSubmit}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Modal for editing project resource */}
              {isEditModalOpen && resourceToEdit && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
                  <div className="bg-white p-6 rounded-lg w-96">
                    <h3 className="text-xl font-bold mb-4">Edit Resource</h3>

                    {/* Section 1: Icon Upload */}
                    <div className="mb-4">
                      <label className="block text-sm font-semibold mb-2">
                        Upload Icon
                      </label>
                      <input
                        type="file"
                        className="w-full p-2 border border-gray-300 rounded"
                        onChange={(e) => setEditIconName(e.target.files?.[0]?.name || "")}
                      />
                    </div>

                    {/* Section 2: Title Input */}
                    <div className="mb-4">
                      <label className="block text-sm font-semibold mb-2">Title</label>
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Enter title"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                      />
                    </div>

                    {/* Modal buttons */}
                    <div className="flex justify-end">
                      <button
                        onClick={closeEditModal}
                        className="bg-gray-300 text-black px-4 py-2 rounded mr-2 hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleEditResourceSubmit}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ConfigSubmission;
