"use client";
import React, { useEffect, useState } from "react";
import Spinner from "@/components/Spinner";
import getProjectConfig from "@/utils/configform/getProjectConfig";
import { fetchProjectResourceConfigs } from "@/utils/configform/getProjectResourceConfig";
import getAllEmployees from "@/utils/advisorstats/getAllEmployee";
import { Advisor } from "@/models/Advisor";
import Select from "react-select";
import Image from "next/image";

// Types
interface ProjectResourceConfig {
  id: number;
  icon_name: string;
  is_active: boolean;
  program_id: number;
  resource_type_id: number;
  title: string;
  resource_type: {
    type_name: string;
  };
}

interface FormConfig {
  [key: string]: boolean | ProjectResourceConfig[];
}

interface FormData {
  [key: string]:
    | string
    | string[]
    | { url: string }[]
    | { value: number; label: string }[]
    | undefined;
}

const CreateProject: React.FC = () => {
  const [formConfig, setFormConfig] = useState<FormConfig>({});
  const [formData, setFormData] = useState<FormData>({});
  const [loading, setLoading] = useState(true);
  const [staffList, setStaffList] = useState<Advisor[]>([]);

  const labels: Record<string, string> = {
    course_id: "Course",
    section_id: "Section",
    semester: "Semester",
    academic_year: "Academic Year",
    title_en: "Project Title (EN)",
    title_th: "Project Title (TH)",
    abstract_text: "Abstract",
    student: "Students",
    advisor: "Advisor",
    co_advisor: "Co-Advisor",
    committee: "Committee Members",
    external_committee: "External Committee Members",
    report_pdf: "Report PDF",
  };

  const requiredFields: string[] = [
    "course_id",
    "title_en",
    "student",
    "committee",
    "report_pdf",
  ];

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = await getProjectConfig(1); // Replace '1' with appropriate majorId
        const activeFields = config.reduce<FormConfig>((acc, field) => {
          if (field.is_active) acc[field.title] = true;
          return acc;
        }, {});
        setFormConfig(activeFields);

        const projectResourceConfigs = await fetchProjectResourceConfigs(1); // Replace with programId
        setFormConfig((prevConfig) => ({
          ...prevConfig,
          report_pdf: projectResourceConfigs,
        }));

        const employees = await getAllEmployees();
        setStaffList(employees);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleMultiSelectChange = (
    selectedOptions: { value: number; label: string }[],
    field: string
  ) => {
    setFormData((prevData) => ({ ...prevData, [field]: selectedOptions }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string
  ) => {
    const files = e.target.files;
    if (files) {
      const fileUrls = Array.from(files).map((file) => ({
        url: URL.createObjectURL(file),
      }));
      setFormData((prevData) => ({ ...prevData, [fieldName]: fileUrls }));
    }
  };

  const renderInputField = (
    field: string,
    label: string,
    isRequired: boolean,
    type: string = "text"
  ) => {
    if (!formConfig[field]) return null;

    return (
      <div className="mb-4">
        <label className="block mb-1 text-sm font-medium text-gray-700">
          {label} {isRequired && <span className="text-red-500 ml-1">*</span>}
        </label>
        <input
          type={type}
          name={field}
          value={(formData[field] as string) || ""}
          onChange={handleInputChange}
          className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
          placeholder={`Enter ${label}`}
        />
      </div>
    );
  };

  const renderTextArea = (
    field: string,
    label: string,
    isRequired: boolean
  ) => (
    <div className="mb-6">
      <label className="block mb-1 text-sm font-medium text-gray-700">
        {label} {isRequired && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        name={field}
        value={(formData[field] as string) || ""}
        onChange={handleInputChange}
        rows={3}
        className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500 resize-y"
        placeholder={`Enter ${label}`}
      />
    </div>
  );

  const renderFields = (fields: string[]) =>
    fields.map((field) => {
      if (formConfig[field]) {
        return (
          <div key={field}>
            {field === "abstract_text"
              ? renderTextArea(
                  field,
                  labels[field],
                  requiredFields.includes(field)
                )
              : renderInputField(
                  field,
                  labels[field],
                  requiredFields.includes(field)
                )}
          </div>
        );
      }
      return null;
    });

  const renderMultiSelectField = (
    field: string,
    label: string,
    isRequired: boolean
  ) => {
    if (!formConfig[field]) return null;

    return (
      <div className="mb-4">
        <label className="block mb-1 text-sm font-medium text-gray-700">
          {label} {isRequired && <span className="text-red-500 ml-1">*</span>}
        </label>
        <Select
          isMulti
          name={field}
          value={(formData[field] as { value: number; label: string }[]) || []} // Ensure proper type assertion
          onChange={(selectedOptions) =>
            handleMultiSelectChange(
              selectedOptions as { value: number; label: string }[],
              field
            )
          }
          options={staffList.map((staff) => ({
            label: `${staff.prefix} ${staff.first_name} ${staff.last_name}`,
            value: staff.id,
          }))}
          getOptionLabel={(e) => e.label} // Ensure the correct label is displayed
          getOptionValue={(e) => e.value.toString()} // Convert value to string if needed
          className="w-full"
        />
      </div>
    );
  };

  const renderFileUploadSections = () => {
    const fileConfigs = formConfig["report_pdf"] as
      | ProjectResourceConfig[]
      | undefined;

    if (!fileConfigs) return null;

    return fileConfigs.map((fileConfig) => {
      if (!fileConfig.is_active) return null;

      return (
        <div
          key={fileConfig.id}
          className="p-4 mb-4 rounded-lg border border-gray-300 bg-white"
        >
          <div className="flex items-center mb-4">
            {fileConfig.icon_name && (
              <Image
                className="w-8 h-8 rounded-full"
                src="/logo-engcmu/CMU_LOGO_Crop.jpg"
                alt=""
                width={32}
                height={32}
              />
            )}
            <h6 className="text-lg font-bold">{fileConfig.title}</h6>
          </div>

          {fileConfig.resource_type.type_name === "url" ? (
            <div>
              <label className="block text-sm font-semibold mb-2">
                Paste Link
              </label>
              <input
                type="text"
                name={`file_link_${fileConfig.id}`}
                value={(formData[`file_link_${fileConfig.id}`] as string) || ""}
                onChange={handleInputChange}
                className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
                placeholder="Paste the URL here"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-semibold mb-2">
                Upload File
              </label>
              <input
                type="file"
                name={`file_upload_${fileConfig.id}`}
                onChange={(e) =>
                  handleFileChange(e, `file_upload_${fileConfig.id}`)
                }
                className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
              />
            </div>
          )}
        </div>
      );
    });
  };

  const handleSubmit = async () => {
    try {
      console.log("Form Data:", formData);
      alert("Form submitted successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit the form.");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="flex flex-col min-h-screen bg-stone-100 py-6">
      <div className="container mx-auto max-w-3xl">
        <h6 className="mb-4 text-lg font-bold">Create Project</h6>
        <div className="p-6 mb-6 rounded-lg border border-gray-300 bg-white">
          <h6 className="text-lg font-bold mb-4">Project Details</h6>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {renderFields([
              "course_id",
              "section_id",
              "semester",
              "academic_year",
            ])}
          </div>
          {renderFields(["title_en", "title_th"])}
          {renderFields(["abstract_text"])}
        </div>
        <div className="p-6 mb-6 rounded-lg border border-gray-300 bg-white">
          <h6 className="text-lg font-bold mb-4">Team Details</h6>
          {renderInputField("student", "Students", true)}
          {renderMultiSelectField("advisor", "Advisor", true)}
          {renderMultiSelectField("co_advisor", "Co-Advisor", false)}
          {renderMultiSelectField("committee", "Committee Members", false)}
          {renderMultiSelectField(
            "external_committee",
            "External Committee Members",
            false
          )}
        </div>
        <div className="p-6 mb-6 rounded-lg border border-gray-300 bg-white">
          <h6 className="text-lg font-bold mb-4">Uploads</h6>
          {renderFileUploadSections()}
        </div>
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default CreateProject;
