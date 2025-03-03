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
import { Advisor } from "@/models/Advisor";
import { getStudentsByProgram } from "@/utils/createproject/getStudentsByProgram";
import { Student } from "@/models/Student"; // Import the new Student type
import { getProjectRoles } from "@/utils/createproject/getProjectRoles"; // Import the getProjectRoles function
import { ProjectRole } from "@/models/ProjectRoles"; // Import the ProjectRole type
import { getProjectResourceConfig } from "@/utils/configform/getProjectResourceConfig"; // Import getProjectResourceConfig

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
  const [projectRoles, setProjectRoles] = useState<ProjectRole[]>([]); // Store project roles
  const [projectResourceConfig, setProjectResourceConfig] = useState<
    ProjectResourceConfig[]
  >([]); // Store project resource config
  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    const loadProject = async () => {
      try {
        const projectData = await getProjectById(parseInt(id)); // Fetch project by ID
        setProject(projectData);
        setFormData({
          title_en: projectData.titleEN || "",
          title_th: projectData.titleTH,
          abstract_text: projectData.abstractText,
          academicYear: projectData.academicYear?.toString(),
          courseNo: projectData.course?.courseNo,
          section: projectData.sectionId,
          semester: projectData.semester?.toString(),
          student: projectData.members.map((member) => ({
            value: parseInt(member.id, 10),
            label: `${member.firstName} ${member.lastName} (${member.studentId})`,
          })),
          advisor: projectData.staffs
            .filter((staff) => staff.projectRole.roleNameEN === "Advisor")
            .map((staff) => ({
              value: staff.id,
              label: `${staff.prefixEN} ${staff.firstNameEN} ${staff.lastNameEN} / ${staff.prefixTH} ${staff.firstNameTH} ${staff.lastNameTH}`,
            })),
          co_advisor: projectData.staffs
            .filter((staff) => staff.projectRole.roleNameEN === "Co-Advisor")
            .map((staff) => ({
              value: staff.id,
              label: `${staff.prefixEN} ${staff.firstNameEN} ${staff.lastNameEN} / ${staff.prefixTH} ${staff.firstNameTH} ${staff.lastNameTH}`,
            })),
          committee: projectData.staffs
            .filter((staff) => staff.projectRole.roleNameEN === "Committee")
            .map((staff) => ({
              value: staff.id,
              label: `${staff.prefixEN} ${staff.firstNameEN} ${staff.lastNameEN} / ${staff.prefixTH} ${staff.firstNameTH} ${staff.lastNameTH}`,
            })),
          external_committee: projectData.staffs
            .filter(
              (staff) =>
                staff.projectRole.roleNameEN === "External Committee Members"
            )
            .map((staff) => ({
              value: staff.id,
              label: `${staff.prefixEN} ${staff.firstNameEN} ${staff.lastNameEN} / ${staff.prefixTH} ${staff.firstNameTH} ${staff.lastNameTH}`,
            })),
          // Add other fields as needed
        });

        if (
          !projectData.projectResources ||
          projectData.projectResources.length === 0
        ) {
          const resourceConfig = await getProjectResourceConfig(
            projectData.program.id
          ); // Fetch project resource config
          setProjectResourceConfig(resourceConfig);
        }

        const employees = await getAllEmployees();
        setStaffList(employees);

        const students = await getStudentsByProgram(projectData.program.id); // Use program ID from project data
        setStudentList(students);

        const roles = await getProjectRoles(); // Fetch project roles
        setProjectRoles(roles);
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
        if (!fileConfig.is_active) return null; // Display only active fields

        return (
          <div
            key={fileConfig.id}
            className="p-4 mb-4 rounded-lg border border-gray-300 bg-white"
          >
            <div className="flex items-center mb-4">
              {/* {fileConfig.icon_name && (
                <Image
                  className="w-8 h-8 rounded-full"
                  src="/logo-engcmu/CMU_LOGO_Crop.jpg"
                  alt=""
                  width={32}
                  height={32}
                />
              )} */}
              <h6 className="text-lg font-bold">{fileConfig.title}</h6>
            </div>

            {fileConfig.resource_type && fileConfig.resource_type.id === 2 ? (
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
    }

    return fileConfigs.map((resource) => {
      return (
        <div
          key={resource.id}
          className="p-4 mb-4 rounded-lg border border-gray-300 bg-white"
        >
          <div className="flex items-center mb-4">
            {/* {resource.icon_name && (
              <Image
                className="w-8 h-8 rounded-full"
                src="/logo-engcmu/CMU_LOGO_Crop.jpg"
                alt=""
                width={32}
                height={32}
              />
            )} */}
            <h6 className="text-lg font-bold">{resource.title}</h6>
          </div>

          {resource.resourceType.id === 2 ? (
            <div>
              <label className="block text-sm font-semibold mb-2">
                Paste Link
              </label>
              <input
                type="text"
                name={`file_link_${resource.id}`}
                value={(formData[`file_link_${resource.id}`] as string) || ""}
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
                name={`file_upload_${resource.id}`}
                onChange={(e) =>
                  handleFileChange(e, `file_upload_${resource.id}`)
                }
                className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
              />
            </div>
          )}

          <div className="mt-4">
            {resource.url ? (
              <a
                href={resource.url}
                className="font-semibold text-blue-500 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {resource.title !== null ? resource.title : "No Title"}
              </a>
            ) : (
              <p className="font-semibold text-gray-800">
                {resource.title !== null ? resource.title : "No Title"}
              </p>
            )}
            {resource.resourceName && (
              <p className="text-gray-500 text-sm">
                Resource Name: {resource.resourceName}
              </p>
            )}
            {resource.createdAt && (
              <p className="text-gray-500 text-sm">
                Created At: {resource.createdAt}
              </p>
            )}
          </div>
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
        project_no: project?.projectNo, // Include project_no
        title_th: formData.title_th,
        title_en: formData.title_en,
        abstract_text: formData.abstract_text,
        academic_year: parseInt(formData.academicYear as string, 10),
        semester: parseInt(formData.semester as string, 10),
        section_id: formData.section,
        course_id: project?.course?.id,
        program_id: project?.program?.id,
        staffs: [
          ...(formData.advisor as { value: number; label: string }[]).map(
            (advisor) => ({
              staff_id: advisor.value,
              project_role_id:
                projectRoles.find((role) => role.role_name_en === "Advisor")
                  ?.id || 1,
            })
          ),
          ...(formData.co_advisor as { value: number; label: string }[]).map(
            (coAdvisor) => ({
              staff_id: coAdvisor.value,
              project_role_id:
                projectRoles.find((role) => role.role_name_en === "Co-Advisor")
                  ?.id || 2,
            })
          ),
          ...(formData.committee as { value: number; label: string }[]).map(
            (committee) => ({
              staff_id: committee.value,
              project_role_id:
                projectRoles.find((role) => role.role_name_en === "Committee")
                  ?.id || 3,
            })
          ),
          ...(
            formData.external_committee as { value: number; label: string }[]
          ).map((externalCommittee) => ({
            staff_id: externalCommittee.value,
            project_role_id:
              projectRoles.find(
                (role) => role.role_name_en === "External Committee Members"
              )?.id || 4,
          })),
        ],
        members: (formData.student as { value: number; label: string }[]).map(
          (student) => ({
            id: student.value,
          })
        ),
      };

      formDataToSend.append("project", JSON.stringify(projectData));

      const fileConfigs = project?.projectResources as
        | ProjectResourceConfig[]
        | undefined;
      if (fileConfigs) {
        fileConfigs.forEach((fileConfig) => {
          if (!fileConfig.is_active) return;

          const linkField = `file_link_${fileConfig.id}`;
          const fileField = `file_upload_${fileConfig.id}`;

          if (formData[linkField]) {
            formDataToSend.append(
              "projectResources[]",
              JSON.stringify({
                title: fileConfig.title,
                url: formData[linkField],
              })
            );
          }

          const selectedFiles = formData[fileField] as FileList | undefined;
          if (selectedFiles && selectedFiles.length > 0) {
            formDataToSend.append(
              "projectResources[]",
              JSON.stringify({
                title: fileConfig.title,
              })
            );

            Array.from(selectedFiles).forEach((file) => {
              formDataToSend.append("files", file, file.name);
            });
          }
        });
      }

      const newFileConfigs = projectResourceConfig as
        | ProjectResourceConfig[]
        | undefined;
      if (newFileConfigs) {
        newFileConfigs.forEach((fileConfig) => {
          if (!fileConfig.is_active) return;

          const linkField = `file_link_${fileConfig.id}`;
          const fileField = `file_upload_${fileConfig.id}`;

          if (formData[linkField]) {
            formDataToSend.append(
              "projectResources[]",
              JSON.stringify({
                title: fileConfig.title,
                url: formData[linkField],
              })
            );
          }

          const selectedFiles = formData[fileField] as FileList | undefined;
          if (selectedFiles && selectedFiles.length > 0) {
            formDataToSend.append(
              "projectResources[]",
              JSON.stringify({
                title: fileConfig.title,
              })
            );

            Array.from(selectedFiles).forEach((file) => {
              formDataToSend.append("files", file, file.name);
            });
          }
        });
      }

      await axios.put(
        `https://project-service.kunmhing.me/api/v1/projects`,
        formDataToSend,
        {
          headers: {
            Authorization:
              "Bearer Pl6sXUmjwzNtwcA4+rkBP8jTmRttcNwgJqp1Zn1a+qCRaYXdYdwgJ9mM5glzHQD2FOsLilpELbmVSF2nGZCOwTO6u5CTsVpyIGDguXoMobSApgEsO3avovqWYDAEuznY/Vu4XMvHDkFqyuY1dQfN+QdB04t89/1O/w1cDnyilFU=",
            "Content-Type": "multipart/form-data",
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
