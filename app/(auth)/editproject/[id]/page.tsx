"use client";

import React, { useEffect, useState } from "react";
import Spinner from "@/components/Spinner";
import { Project, ProjectResource } from "@/models/Project";
import getProjectById from "@/utils/projects/getProjectById";
import { ProjectResourceConfig } from "@/models/ProjectResourceConfig"; // Import ProjectResourceConfig type
import Select from "react-select";
import Image from "next/image";
import axios from "axios"; // Import axios for making API requests
import { useRouter } from "next/navigation"; // Import useRouter from next/navigation
import getAllEmployees from "@/utils/advisorstats/getAllEmployee";
import { Advisor } from "@/models/Advisor"
import { getStudentsByProgram } from "@/utils/createproject/getStudentsByProgram";
import { Student } from "@/models/Student"; // Import the Student type
import { getProjectResourceConfig } from "@/utils/configform/getProjectResourceConfig"; // Import getProjectResourceConfig
import EditIcon from '@mui/icons-material/Edit';

interface EditProjectPageProps {
  params: {
    id: string;
  };
}

interface FormData {
  [key: string]:
    | string
    | string[]
    | { url: string }[]
    | { value: number; label: string }[]
    | FileList
    | undefined;
  academicYear?: string;
  courseNo?: string;
  section?: string;
  semester?: string;
}

const labels: { [key: string]: string } = {
  title_en: "Title (English)",
  title_th: "Title (Thai)",
  abstract_text: "Abstract",
  academicYear: "Academic Year",
  courseNo: "Course No",
  section: "Section",
  semester: "Semester",
  student: "Students",
  advisor: "Advisor",
  co_advisor: "Co-Advisor",
  committee: "Committee Members",
  external_committee: "External Committee Members",
  // Add other labels as needed
};

const requiredFields: string[] = [
  "title_en",
  "title_th",
  "abstract_text",
  "academicYear",
  "courseNo",
  "section",
  "semester",
]; // Define required fields

const EditProjectPage: React.FC<EditProjectPageProps> = ({ params }) => {
  const { id } = params; // Get project ID from the route params
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<FormData>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [staffList, setStaffList] = useState<Advisor[]>([]);
  const [studentList, setStudentList] = useState<Student[]>([]); // Store student list
  const [projectResourceConfig, setProjectResourceConfig] = useState<
    ProjectResourceConfig[]
  >([]); // Store project resource config
  const router = useRouter(); // Initialize useRouter
  const [editModeResources, setEditModeResources] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const loadProject = async () => {
      try {
        const projectData = await getProjectById(parseInt(id)); // Fetch project by ID
        setProject(projectData);
        
        // Initialize form data
        setFormData({
          title_en: projectData.titleEN || "",
          title_th: projectData.titleTH,
          abstract_text: projectData.abstractText,
          academicYear: projectData.academicYear?.toString(),
          courseNo: projectData.course?.courseNo,
          section: projectData.sectionId,
          semester: projectData.semester?.toString(),
          // Map students with correct id and type
          student: projectData.members.map((member) => ({
            value: typeof member.id === 'string' ? parseInt(member.id, 10) : member.id,
            label: `${member.firstName} ${member.lastName} (${member.studentId})`,
          })),
          // Map advisor (role_id: 1)
          advisor: projectData.staffs
            .filter((staff) => staff.projectRole.id === 1)
            .map((staff) => ({
              value: staff.id,
              label: `${staff.prefixEN} ${staff.firstNameEN} ${staff.lastNameEN} / ${staff.prefixTH} ${staff.firstNameTH} ${staff.lastNameTH}`,
            })),
          // Map co-advisor (role_id: 2)
          co_advisor: projectData.staffs
            .filter((staff) => staff.projectRole.id === 2)
            .map((staff) => ({
              value: staff.id,
              label: `${staff.prefixEN} ${staff.firstNameEN} ${staff.lastNameEN} / ${staff.prefixTH} ${staff.firstNameTH} ${staff.lastNameTH}`,
            })),
          // Map committee (role_id: 3)
          committee: projectData.staffs
            .filter((staff) => staff.projectRole.id === 3)
            .map((staff) => ({
              value: staff.id,
              label: `${staff.prefixEN} ${staff.firstNameEN} ${staff.lastNameEN} / ${staff.prefixTH} ${staff.firstNameTH} ${staff.lastNameTH}`,
            })),
          // Map external committee (role_id: 4)
          external_committee: projectData.staffs
            .filter((staff) => staff.projectRole.id === 4)
            .map((staff) => ({
              value: staff.id,
              label: `${staff.prefixEN} ${staff.firstNameEN} ${staff.lastNameEN} / ${staff.prefixTH} ${staff.firstNameTH} ${staff.lastNameTH}`,
            })),
        });

        // Always fetch resource configs for the program
        if (projectData?.program?.id) {
          const configs = await getProjectResourceConfig(projectData.program.id);
          setProjectResourceConfig(configs);
        }

        const employees = await getAllEmployees();
        setStaffList(employees);

        const students = await getStudentsByProgram(projectData.program.id);
        setStudentList(students);

        const configs = await getProjectResourceConfig(projectData.program.id);
        setProjectResourceConfig(configs);
      } catch (error) {
        console.error("Error fetching project details:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [id]);

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
      setFormData((prevData) => ({
        ...prevData,
        [fieldName]: files,
      }));
    }
  };

  const toggleEditMode = (resourceId: string) => {
    setEditModeResources(prev => ({
      ...prev,
      [resourceId]: !prev[resourceId]
    }));
  };

  const renderInputField = (
    field: string,
    label: string,
    isRequired: boolean,
    type: string = "text"
  ) => (
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
    fields.map((field) => (
      <div key={field}>
        {field === "abstract_text"
          ? renderTextArea(field, labels[field], requiredFields.includes(field))
          : renderInputField(
              field,
              labels[field],
              requiredFields.includes(field)
            )}
      </div>
    ));

  const renderMultiSelectField = (
    field: string,
    label: string,
    isRequired: boolean,
    optionsList: { value: number; label: string }[]
  ) => (
    <div className="mb-4">
      <label className="block mb-1 text-sm font-medium text-gray-700">
        {label} {isRequired && <span className="text-red-500 ml-1">*</span>}
      </label>
      <Select
        isMulti
        name={field}
        value={(formData[field] as { value: number; label: string }[]) || []}
        onChange={(selectedOptions) =>
          handleMultiSelectChange(
            selectedOptions as { value: number; label: string }[],
            field
          )
        }
        options={optionsList}
        getOptionLabel={(e) => e.label}
        getOptionValue={(e) => e.value.toString()}
        className="w-full"
      />
    </div>
  );

  const renderFileUploadSections = () => {
    const fileConfigs = project?.projectResources as ProjectResource[] | undefined;

    if (!fileConfigs || fileConfigs.length === 0) {
      return projectResourceConfig.map((fileConfig) => {
        if (!fileConfig.is_active || !fileConfig.id) return null;

        const configId = fileConfig.id;
        const isEditMode = editModeResources[configId.toString()];

        return (
          <div
            key={configId}
            className="p-4 mb-4 rounded-lg border border-gray-300 bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center">
                  <div className="w-6 h-6 flex items-center justify-center">
                    <Image
                      src={fileConfig.icon_url || "/IconProjectBox/BlueBox.png"}
                      alt={fileConfig.icon_name || "Default Icon"}
                      width={24}
                      height={24}
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900">{fileConfig.title}</h3>
                </div>
              </div>
              <button 
                onClick={() => toggleEditMode(configId.toString())}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Edit resource"
              >
                <EditIcon className="text-gray-600 w-5 h-5" />
              </button>
            </div>

            {isEditMode && (
              <div className="mt-4 pl-13">
                {fileConfig.title.toLowerCase() === "pdf" ? (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Upload PDF File
                    </label>
                    <input
                      type="file"
                      accept=".pdf"
                      name={`file_upload_${configId}`}
                      onChange={(e) => handleFileChange(e, `file_upload_${configId}`)}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100
                        cursor-pointer border rounded-lg
                        focus:outline-none focus:border-blue-500
                        focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                ) : fileConfig.resource_type.id === 2 ? (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Resource URL
                    </label>
                    <input
                      type="text"
                      name={`file_link_${configId}`}
                      value={(formData[`file_link_${configId}`] as string) || ""}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-2 text-sm
                        border border-gray-300 rounded-lg
                        focus:outline-none focus:border-blue-500
                        focus:ring-1 focus:ring-blue-500
                        placeholder-gray-400"
                      placeholder="Enter resource URL"
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Upload File
                    </label>
                    <input
                      type="file"
                      name={`file_upload_${configId}`}
                      onChange={(e) => handleFileChange(e, `file_upload_${configId}`)}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100
                        cursor-pointer border rounded-lg
                        focus:outline-none focus:border-blue-500
                        focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        );
      });
    }

    return fileConfigs.map((resource) => {
      const isEditMode = editModeResources[resource.id.toString()];
      // Find matching config by title (case-insensitive)
      const matchingConfig = projectResourceConfig.find(
        config => config.title?.toLowerCase() === resource.title?.toLowerCase()
      );

      return (
        <div
          key={resource.id}
          className="p-4 mb-4 rounded-lg border border-gray-300 bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center">
                {matchingConfig ? (
                  <div className="w-6 h-6 flex items-center justify-center">
                    <Image
                      src={matchingConfig.icon_url || "/IconProjectBox/BlueBox.png"}
                      alt={matchingConfig.icon_name || "Resource Icon"}
                      width={24}
                      height={24}
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="w-6 h-6 flex items-center justify-center">
                    <Image
                      src="/IconProjectBox/BlueBox.png"
                      alt="Default Icon"
                      width={24}
                      height={24}
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900">{resource.title}</h3>
                {resource.url && (
                  <a
                    href={resource.url}
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Resource
                  </a>
                )}
              </div>
            </div>
            <button 
              onClick={() => toggleEditMode(resource.id.toString())}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Edit resource"
            >
              <EditIcon className="text-gray-600 w-5 h-5" />
            </button>
          </div>

          {isEditMode && (
            <div className="mt-4 pl-13">
              {resource.title?.toLowerCase() === "pdf" ? (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Upload PDF File
                  </label>
                  <input
                    type="file"
                    accept=".pdf"
                    name={`file_upload_${resource.id}`}
                    onChange={(e) => handleFileChange(e, `file_upload_${resource.id}`)}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100
                      cursor-pointer border rounded-lg
                      focus:outline-none focus:border-blue-500
                      focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              ) : resource.resourceType.id === 2 ? (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Resource URL
                  </label>
                  <input
                    type="text"
                    name={`file_link_${resource.id}`}
                    value={(formData[`file_link_${resource.id}`] as string) || ""}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 text-sm
                      border border-gray-300 rounded-lg
                      focus:outline-none focus:border-blue-500
                      focus:ring-1 focus:ring-blue-500
                      placeholder-gray-400"
                    placeholder="Enter resource URL"
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Upload File
                  </label>
                  <input
                    type="file"
                    name={`file_upload_${resource.id}`}
                    onChange={(e) => handleFileChange(e, `file_upload_${resource.id}`)}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100
                      cursor-pointer border rounded-lg
                      focus:outline-none focus:border-blue-500
                      focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      );
    });
  };

  const handleSubmit = async () => {
    if (isSubmitting) return; // Prevent duplicate submissions
    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();

      const projectData = {
        id: parseInt(id, 10),
        project_no: project?.projectNo,
        title_th: formData.title_th,
        title_en: formData.title_en,
        abstract_text: formData.abstract_text,
        academic_year: parseInt(formData.academicYear as string, 10),
        semester: parseInt(formData.semester as string, 10),
        section_id: formData.section,
        course_id: project?.course?.id,
        program_id: project?.program?.id,
        staffs: [
          // Map advisor with role_id 1
          ...(formData.advisor ? (formData.advisor as { value: number; label: string }[]).map(
            (advisor) => ({
              staff_id: advisor.value,
              project_role_id: 1
            })
          ) : []),
          // Map co-advisor with role_id 2
          ...(formData.co_advisor ? (formData.co_advisor as { value: number; label: string }[]).map(
            (coAdvisor) => ({
              staff_id: coAdvisor.value,
              project_role_id: 2
            })
          ) : []),
          // Map committee with role_id 3
          ...(formData.committee ? (formData.committee as { value: number; label: string }[]).map(
            (committee) => ({
              staff_id: committee.value,
              project_role_id: 3
            })
          ) : []),
          // Map external committee with role_id 4
          ...(formData.external_committee ? (formData.external_committee as { value: number; label: string }[]).map(
            (externalCommittee) => ({
              staff_id: externalCommittee.value,
              project_role_id: 4
            })
          ) : []),
        ],
        members: formData.student ? (formData.student as { value: number; label: string }[]).map(
          (student) => ({
            id: student.value,
          })
        ) : [],
      };

      formDataToSend.append("project", JSON.stringify(projectData));

      const fileConfigs = project?.projectResources || projectResourceConfig;
      if (fileConfigs) {
        fileConfigs.forEach((fileConfig) => {
          const configId = fileConfig.id;
          const linkField = `file_link_${configId}`;
          const fileField = `file_upload_${configId}`;

          const existingResource = project?.projectResources?.find(
            (resource) => resource.id === configId
          );

          // For resources with title "pdf", always treat as file upload
          const isPdfResource = (existingResource?.title || fileConfig.title)?.toLowerCase() === "pdf";

          // Handle URL resources
          if (formData[linkField] && !isPdfResource) {
            formDataToSend.append(
              "projectResources[]",
              JSON.stringify({
                title: existingResource?.title || fileConfig.title,
                url: formData[linkField],
                resource_type_id: 2, // URL type
                ...(existingResource?.id && { id: existingResource.id })
              })
            );
          }

          // Handle file uploads
          const selectedFiles = formData[fileField] as FileList | undefined;
          if (selectedFiles && selectedFiles.length > 0) {
            formDataToSend.append(
              "projectResources[]",
              JSON.stringify({
                title: existingResource?.title || fileConfig.title,
                resource_type_id: 1, // File type
                ...(existingResource?.id && { id: existingResource.id })
              })
            );

            Array.from(selectedFiles).forEach((file) => {
              formDataToSend.append("files", file);
            });
          } else if (existingResource && !formData[linkField]) {
            // Keep existing resource if no new file or URL is provided
            formDataToSend.append(
              "projectResources[]",
              JSON.stringify({
                id: existingResource.id,
                title: existingResource.title,
                url: existingResource.url,
                resource_type_id: isPdfResource ? 1 : existingResource.resourceTypeId
              })
            );
          }
        });
      }

      // Make the API request
      await axios.put(
        `https://project-service.kunmhing.me/api/v1/projects`,
        formDataToSend,
        {
          headers: {
            Authorization:
              "Bearer Pl6sXUmjwzNtwcA4+rkBP8jTmRttcNwgJqp1Zn1a+qCRaYXdYdwgJ9mM5glzHQD2FOsLilpELbmVSF2nGZCOwTO6u5CTsVpyIGDguXoMobSApgEsO3avovqWYDAEuznY/Vu4XMvHDkFqyuY1dQfN+QdB04t89/1O/w1cDnyilFU=",
          },
        }
      );

      alert("Form submitted successfully!");
      router.push("/dashboard"); // Redirect to dashboard page
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit the form.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <Spinner />;
  if (!project) return <p>No project found.</p>;

  return (
    <div className="flex flex-col min-h-screen bg-stone-100 py-6">
      <div className="container mx-auto max-w-3xl">
        <h6 className="mb-4 text-lg font-bold">Edit Project</h6>

        <div className="p-6 mb-6 rounded-lg border border-gray-300 bg-white">
          <h6 className="text-lg font-bold mb-4">Project Details</h6>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {renderFields(["courseNo", "section", "semester", "academicYear"])}
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
          className={`bg-blue-500 text-white px-4 py-2 rounded ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
          }`}
          disabled={isSubmitting}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default EditProjectPage;
