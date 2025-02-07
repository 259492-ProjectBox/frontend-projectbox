"use client";
import React, { useEffect, useState } from "react";
import Spinner from "@/components/Spinner";
import getProjectConfig from "@/utils/configform/getProjectConfig";
import { getProjectResourceConfig } from "@/utils/configform/getProjectResourceConfig";
import getAllEmployees from "@/utils/advisorstats/getAllEmployee";
import { Advisor } from "@/models/Advisor";
import Select from "react-select";
import Image from "next/image";
import { getConfigProgram } from "@/utils/configprogram/configProgram";
import { useAuth } from "@/hooks/useAuth";
import { getStudentInfo } from "@/utils/createproject/getStudentInfo"; // Import the new utility function
import { getStudentsByProgram } from "@/utils/createproject/getStudentsByProgram";
import { Student } from "@/models/Student"; // Import the new Student type
import { ConfigProgramSetting } from "@/models/ConfigProgram";
import axios from "axios"; // Import axios for making API requests
import { useRouter } from "next/navigation"; // Import useRouter from next/navigation

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
    | FileList
    | undefined;
}

const CreateProject: React.FC = () => {
  const [formConfig, setFormConfig] = useState<FormConfig>({});
  const [formData, setFormData] = useState<FormData>({});
  const [loading, setLoading] = useState(true);
  const [staffList, setStaffList] = useState<Advisor[]>([]);
  const [studentList, setStudentList] = useState<Student[]>([]); // Store student list
  const [configProgram, setConfigProgram] = useState<ConfigProgramSetting[]>([]);
  const [data, setData] = useState<Student | null>(null);

  const { user } = useAuth(); // Get user from useAuth
  const router = useRouter(); // Initialize useRouter

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
      if (!user?.studentId) return; // Ensure studentId is available

      try {
        // Fetch student data using the studentId from useAuth
        const data = await getStudentInfo(user.studentId)
        setData(data);

        if (data?.program_id) {
          const config = await getProjectConfig(data.program_id); // Use program ID from student data
          const activeFields = config.reduce<FormConfig>((acc, field) => {
            if (field.is_active) acc[field.title] = true;
            return acc;
          }, {});
          setFormConfig(activeFields);

          const projectResourceConfigs = await getProjectResourceConfig(data.program_id); // Use program ID from student data
          setFormConfig((prevConfig) => ({
            ...prevConfig,
            report_pdf: projectResourceConfigs,
          }));

          const employees = await getAllEmployees();
          setStaffList(employees);

          const students = await getStudentsByProgram(data.program_id); // Use program ID from student data
          setStudentList(students);

          const programConfig = await getConfigProgram(data.program_id); // Fetch program config
          setConfigProgram(programConfig);

          // Pre-fill course and section
          setFormData((prevData) => ({
            ...prevData,
            course_id: data.course.course_no,
            section_id: data.sec_lab,
          }));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.studentId]); // Re-run effect when studentId changes

  // Prefill academic year and semester
  useEffect(() => {
    if (configProgram.length > 0) {
      const prefilledData: Partial<FormData> = {};

      configProgram.forEach((config) => {
        if (formConfig[config.config_name.replace(" ", "_")]) {
          prefilledData[config.config_name.replace(" ", "_")] = config.value;
        }
      });

      setFormData((prevData) => ({
        ...prevData,
        ...prefilledData,
      }));
    }
  }, [configProgram, formConfig]);

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
    const { files } = e.target;
    if (files && files.length > 0) {
      // Save the FileList directly instead of blob URLs
      setFormData((prevData) => ({
        ...prevData,
        [fieldName]: files,
      }));
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
    isRequired: boolean,
    optionsList: { value: number; label: string }[]
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
          options={optionsList}
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
      // 1. Create a FormData instance.
      const formDataToSend = new FormData();
  
      // 2. Build the JSON for the project itself.
      const projectData = {
        title_th: formData.title_th,
        title_en: formData.title_en,
        abstract_text: formData.abstract_text,
        academic_year: parseInt(formData.academic_year as string, 10),
        semester: parseInt(formData.semester as string, 10),
        section_id: formData.section_id,
        program_id: data?.program_id,
        course_id: data?.course_id,
        staffs: staffList.map((staff) => ({
          staff_id: staff.id,
          project_role_id: 1, // example
        })),
        members: studentList.map((student) => ({
          id: student.id,
        })),
      };
  
      // 3. Append the JSON-serialized project object.
      formDataToSend.append("project", JSON.stringify(projectData));
  
      // 4. For each ProjectResourceConfig, decide if we have a URL or a file upload.
      const fileConfigs = formConfig["report_pdf"] as ProjectResourceConfig[] | undefined;
      if (fileConfigs) {
        fileConfigs.forEach((fileConfig) => {
          if (!fileConfig.is_active) return; // skip if inactive
  
          // If the user entered a link (URL-based resource)
          const linkField = `file_link_${fileConfig.id}`;
          const fileField = `file_upload_${fileConfig.id}`;
  
          // If there's a text link, append it as a resource
          if (formData[linkField]) {
            formDataToSend.append(
              "projectResources[]",
              JSON.stringify({
                title: fileConfig.title,
                url: formData[linkField],
              })
            );
          }
  
          // If the user selected files, append them
          const selectedFiles = formData[fileField] as FileList | undefined;
          if (selectedFiles && selectedFiles.length > 0) {
            // First, append the resource metadata (e.g., just the title)
            formDataToSend.append(
              "projectResources[]",
              JSON.stringify({
                title: fileConfig.title,
              })
            );
  
            // Then, each file in the FileList must be appended as a separate form-data part
            Array.from(selectedFiles).forEach((file) => {
              formDataToSend.append("files", file, file.name);
            });
          }
        });
      }
  
      // 5. Send the formData using axios
      await axios.post(
        "https://project-service.kunmhing.me/api/v1/projects",
        formDataToSend,
        {
          headers: {
            Authorization: "Bearer Pl6sXUmjwzNtwcA4+rkBP8jTmRttcNwgJqp1Zn1a+qCRaYXdYdwgJ9mM5glzHQD2FOsLilpELbmVSF2nGZCOwTO6u5CTsVpyIGDguXoMobSApgEsO3avovqWYDAEuznY/Vu4XMvHDkFqyuY1dQfN+QdB04t89/1O/w1cDnyilFU=",
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      alert("Form submitted successfully!");
      router.push("/dashboard"); // Redirect to dashboard page
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
          {renderMultiSelectField(
            "student",
            "Students",
            true,
            studentList.map((student) => ({
              value: student.id,
              label: `${student.first_name} ${student.last_name} (${student.student_id})`,
            }))
          )}
          {renderMultiSelectField(
            "advisor",
            "Advisor",
            true,
            staffList.map((staff) => ({
              value: staff.id,
              label: `${staff.prefix_en} ${staff.first_name_en} ${staff.last_name_en} / ${staff.prefix_th} ${staff.first_name_th} ${staff.last_name_th}`,
            }))
          )}
          {renderMultiSelectField(
            "co_advisor",
            "Co-Advisor",
            false,
            staffList.map((staff) => ({
              value: staff.id,
              label: `${staff.prefix_en} ${staff.first_name_en} ${staff.last_name_en} / ${staff.prefix_th} ${staff.first_name_th} ${staff.last_name_th}`,
            }))
          )}
          {renderMultiSelectField(
            "committee",
            "Committee Members",
            false,
            staffList.map((staff) => ({
              value: staff.id,
              label: `${staff.prefix_en} ${staff.first_name_en} ${staff.last_name_en} / ${staff.prefix_th} ${staff.first_name_th} ${staff.last_name_th}`,
            }))
          )}
          {renderMultiSelectField(
            "external_committee",
            "External Committee Members",
            false,
            staffList.map((staff) => ({
              value: staff.id,
              label: `${staff.prefix_en} ${staff.first_name_en} ${staff.last_name_en} / ${staff.prefix_th} ${staff.first_name_th} ${staff.last_name_th}`,
            }))
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
