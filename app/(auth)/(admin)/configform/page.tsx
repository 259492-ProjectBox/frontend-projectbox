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
import { ProjectResourceConfig } from "@/models/ProjectResourceConfig";
import createProjectResource from "@/utils/configform/createProjectResource";
import ResourceIconGallery from "@/components/ResourceIconGallery";

const ConfigSubmission: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [apiData, setApiData] = useState<ProjectConfig[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [tableData, setTableData] = useState<ProjectResourceConfig[]>([]);
  const [iconName, setIconName] = useState("");
  const [resourceTypeId, setResourceTypeId] = useState(1);
  const [title, setTitle] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [resourceToEdit, setResourceToEdit] = useState<ProjectResourceConfig | null>(null);
  const [editIconName, setEditIconName] = useState<string>("");
  const [editTitle, setEditTitle] = useState<string>("");
  const [editResourceTypeId, setEditResourceTypeId] = useState<number>(1);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [editIconFile, setEditIconFile] = useState<File | null>(null);
  const [selectedIconPath, setSelectedIconPath] = useState<string>("");
  const [editSelectedIconPath, setEditSelectedIconPath] = useState<string>("");

  const { user } = useAuth();
  const [selectedMajor, setSelectedMajor] = useState<number>(0);
  const [options, setOptions] = useState<AllProgram[]>([]);

  useEffect(() => {
    const fetchOptions = async () => {
      if (!user) return;
      const programOptions = await getProgramOptions(user.isAdmin);
      setOptions(programOptions);

      if (!programOptions.some((option) => option.id === selectedMajor)) {
        setSelectedMajor(0);
      }
    };

    fetchOptions();
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (selectedMajor === 0) return setTableData([]);
        const data = await getProjectResourceConfig(selectedMajor);
        console.log("selectedMajor:", selectedMajor);
        setTableData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [selectedMajor]);

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

    fetchConfig();
  }, [selectedMajor]);

  const handleMajorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMajor = Number(e.target.value);
    setSelectedMajor(newMajor);
    console.log("New selectedMajor:", newMajor);
  };

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

  const handleResourceToggleChange = async (item: ProjectResourceConfig) => {
    const updatedStatus = !item.is_active;
    const updatedData: ProjectResourceConfig = {
      ...item,
      is_active: updatedStatus,
    };
    try {
      await updateResourceStatus(null, updatedData);
      setTableData((prevData) =>
        prevData.map((dataItem) =>
          dataItem.id === item.id ? { ...dataItem, is_active: updatedStatus } : dataItem
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
      setIconFile(file);
      setIconName(file.name);
    }
  };

  const handleEditIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditIconFile(file);
      setEditIconName(file.name);
    }
  };

  const handleIconSelect = async (iconPath: string, iconName: string) => {
    try {
      const response = await fetch(iconPath);
      const blob = await response.blob();
      const file = new File([blob], iconName, { type: 'image/svg+xml' });
      setIconFile(file);
      setIconName(iconName);
      setSelectedIconPath(iconPath);
    } catch (error) {
      console.error('Error loading icon:', error);
    }
  };

  const handleIconDeselect = () => {
    setIconFile(null);
    setIconName("");
    setSelectedIconPath("");
  };

  const handleEditIconSelect = async (iconPath: string, iconName: string) => {
    try {
      const response = await fetch(iconPath);
      const blob = await response.blob();
      const file = new File([blob], iconName, { type: 'image/svg+xml' });
      setEditIconFile(file);
      setEditIconName(iconName);
      setEditSelectedIconPath(iconPath);
    } catch (error) {
      console.error('Error loading icon:', error);
    }
  };

  const handleEditIconDeselect = () => {
    setEditIconFile(null);
    setEditIconName("");
    setEditSelectedIconPath("");
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
      if (!iconFile) {
        alert("Please select an icon file.");
        return;
      }
      await createProjectResource(iconFile, data);
      alert("Project resource created successfully!");
      closeModal();
      window.location.reload(); // Force refresh the page
    } catch (error) {
      console.log(error);
      alert("Failed to create project resource. Please try again.");
    }
  };

  const openEditModal = (resource: ProjectResourceConfig) => {
    setResourceToEdit(resource);
    setEditIconName(resource.icon_name);
    setEditTitle(resource.title);
    setEditResourceTypeId(resource.resource_type_id);
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
        await updateResourceStatus(editIconFile, updatedResource);
        alert("Resource updated successfully!");
        closeEditModal();
        // fetchData();
      } catch (error) {
        console.log(error);
        alert("Failed to update resource. Please try again.");
      }
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
      <Spinner />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Program Selector */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="p-5">
            <label htmlFor="majorSelect" className="block text-sm font-medium text-gray-700">
              Select Program
            </label>
            <select
              id="majorSelect"
              value={selectedMajor}
              onChange={handleMajorChange}
              className="mt-1.5 w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg
                       focus:ring-2 focus:ring-primary-light focus:border-primary-light transition-colors"
            >
              {options.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.program_name_en}
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedMajor !== 0 && (
          <>
            {/* Form Configuration Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
              <div className="p-5 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Project Form Configuration</h2>
                <p className="mt-1 text-sm text-gray-500">Configure which fields should be included in the project form</p>
              </div>

              <div className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Project Details Section */}
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

                  {/* Members Section */}
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

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleSubmit}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary-DEFAULT rounded-lg bg-primary_button
                           hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light
                           transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>

            {/* Resource Configuration Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Resource Configuration</h2>
                  <p className="mt-1 text-sm text-gray-500">Manage uploadable resources for projects</p>
                </div>
                <button
                  onClick={openModal}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-DEFAULT rounded-lg bg-primary_button
                         hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light
                         transition-colors inline-flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Add Resource
                </button>
              </div>

              <div className="p-5">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Icon</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {tableData?.map((item: ProjectResourceConfig, index: number) => (
                        <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center">
                              {item.icon_name ? (
                                <div className="w-6 h-6 flex items-center justify-center">
                                  <Image
                                    src={item.icon_url || "/IconProjectBox/BlueBox.png"}
                                    alt={item.title}
                                    width={24}
                                    height={24}
                                    className="object-contain"
                                    unoptimized
                                  />
                                </div>
                              ) : (
                                <span className="text-sm text-gray-400">N/A</span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">{item.title}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {item.resource_type_id === 1 ? "File" : "Link"}
                          </td>
                          <td className="px-4 py-3">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={item.is_active || false}
                                onChange={() => handleResourceToggleChange(item)}
                              />
                              <div className="w-9 h-5 bg-gray-200 rounded-full peer 
                                          peer-checked:bg-primary-light peer-focus:ring-2 
                                          peer-focus:ring-primary-light/30 
                                          after:content-[''] after:absolute after:top-[2px] 
                                          after:left-[2px] after:bg-white after:rounded-full 
                                          after:h-4 after:w-4 after:transition-all
                                          peer-checked:after:translate-x-full">
                              </div>
                            </label>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => openEditModal(item)}
                              className="text-sm font-medium text-primary-DEFAULT hover:text-primary-dark transition-colors"
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Add Resource Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg m-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Add Resource</h3>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-500 ">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Icon Selection */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Icon
                  </label>
                  <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                    <ResourceIconGallery 
                      onSelectIcon={handleIconSelect}
                      onDeselect={handleIconDeselect}
                      selectedPath={selectedIconPath}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Or Upload Custom Icon
                  </label>
                  <input
                    type="file"
                    className={`w-full px-3 py-2 text-sm border border-gray-200 rounded-lg
                             focus:ring-2 focus:ring-primary-light focus:border-primary-light
                             ${selectedIconPath ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onChange={handleIconChange}
                    disabled={!!selectedIconPath}
                  />
                  {iconName && (
                    <p className="mt-1 text-xs text-gray-500">
                      Selected: {iconName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg
                           focus:ring-2 focus:ring-primary-light focus:border-primary-light"
                    placeholder="Enter resource title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resource Type
                  </label>
                  <select
                    value={resourceTypeId}
                    onChange={(e) => setResourceTypeId(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg
                           focus:ring-2 focus:ring-primary-light focus:border-primary-light"
                  >
                    <option value={1}>File Upload</option>
                    <option value={2}>External Link</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg 
                         hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResourceSubmit}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-DEFAULT rounded-lg bg-primary_button
                         hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light"
                >
                  Add Resource
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Resource Modal - Similar styling as Add Modal */}
      {isEditModalOpen && resourceToEdit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg m-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Edit Resource</h3>
                <button onClick={closeEditModal} className="text-gray-400 hover:text-gray-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Icon
                  </label>
                  <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                    <ResourceIconGallery 
                      onSelectIcon={handleEditIconSelect}
                      onDeselect={handleEditIconDeselect}
                      selectedPath={editSelectedIconPath}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Or Upload Custom Icon
                  </label>
                  <input
                    type="file"
                    className={`w-full px-3 py-2 text-sm border border-gray-200 rounded-lg
                             focus:ring-2 focus:ring-primary-light focus:border-primary-light
                             ${editSelectedIconPath ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onChange={handleEditIconChange}
                    disabled={!!editSelectedIconPath}
                  />
                  {editIconName && (
                    <p className="mt-1 text-xs text-gray-500">
                      Selected: {editIconName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg
                           focus:ring-2 focus:ring-primary-light focus:border-primary-light"
                    placeholder="Enter resource title"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={closeEditModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg
                         hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditResourceSubmit}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-DEFAULT rounded-lg bg-primary_button
                         hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfigSubmission;
