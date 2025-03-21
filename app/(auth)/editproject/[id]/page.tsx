"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Spinner from "@/components/Spinner"
import type { Project } from "@/models/Project"
import getProjectById from "@/app/api/projects/getProjectById"
import type { ProjectResourceConfig } from "@/models/ProjectResourceConfig" // Import ProjectResourceConfig type
import Select from "react-select"
import Image from "next/image"
import { useRouter } from "next/navigation" // Import useRouter from next/navigation
import getAllEmployees from "@/app/api/advisorstats/getAllEmployee"
import type { Advisor } from "@/models/Advisor"
import { getStudentsByProgram } from "@/app/api/createproject/getStudentsByProgram"
import type { Student } from "@/models/Student" // Import the Student type
import { getProjectResourceConfig } from "@/app/api/configform/getProjectResourceConfig" // Import getProjectResourceConfig
import EditIcon from "@mui/icons-material/Edit"
import getAllProgram from "@/utils/getAllProgram"
import type { AllProgram } from "@/models/AllPrograms"
import { useAuth } from "@/hooks/useAuth"
import updateProject from "@/app/api/projects/updateproject"
import { Keyword } from "@/dtos/Keyword"
import getKeywordByProgramID from "@/app/api/keywords/getKeywordByProgramID"
import {  Button, Switch } from "@mui/material"; // Import Modal, Button, and Switch components

interface EditProjectPageProps {
  params: {
    id: string
  }
}

interface FormData {
  [key: string]:
    | string
    | string[]
    | { url: string }[]
    | { value: number; label: string }[]
    | FileList
    | Blob
    | boolean
    | undefined
  academicYear?: string
  // courseNo?: string
  keywords?: { value: number; label: string }[]
  section?: string
  semester?: string
  title_en?: string
  title_th?: string
  abstract_text?: string
  student?: { value: number; label: string }[]
  advisor?: { value: number; label: string }[]
  co_advisor?: { value: number; label: string }[]
  committee?: { value: number; label: string }[]
  external_committee?: { value: number; label: string }[]
}

const labels: { [key: string]: string } = {
  title_en: "Title (English)",
  title_th: "Title (Thai)",
  abstract_text: "Abstract",
  academicYear: "Academic Year",
  // courseNo: "Course No",
  keywords: "Keywords",
  section: "Section",
  semester: "Semester",
  student: "Students",
  advisor: "Advisor",
  co_advisor: "Co-Advisor",
  committee: "Committee Members",
  external_committee: "External Committee Members",
  // Add other labels as needed
}

const requiredFields: string[] = [
  "title_en",
  "title_th",
  "abstract_text",
  "academicYear",
  // "courseNo",
  "section",
  "semester",
] // Define required fields

const EditProjectPage: React.FC<EditProjectPageProps> = ({ params }) => {
  const { id } = params // Get project ID from the route params
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState<FormData>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [staffList, setStaffList] = useState<Advisor[]>([])
  const [studentList, setStudentList] = useState<Student[]>([]) // Store student list
  const [projectResourceConfig, setProjectResourceConfig] = useState<ProjectResourceConfig[]>([]) // Store project resource config
  const [programs, setPrograms] = useState<AllProgram[]>([])
  const router = useRouter() // Initialize useRouter
  const [editModeResources, setEditModeResources] = useState<{ [key: string]: boolean }>({})
  const [fileBlobs, setFileBlobs] = useState<{ [key: string]: Blob }>({})
  const [fileErrors, setFileErrors] = useState<{ [key: string]: string }>({})
  const MAX_FILE_SIZE = 25 * 1024 * 1024 // 25MB in bytes
  const [isDisabled, setIsDisabled] = useState(true); // Add state for isDisabled
  const [keywordList, setKeywordList] = useState<Keyword[]>([]); // Add state for keywordList
  const user = useAuth();
  const [isPublic, setIsPublic] = useState<boolean>(false); // State for is_public
  const [openModal, setOpenModal] = useState<boolean>(false); // State for modal

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleConfirmPublic = () => {
    setIsPublic(true);
    handleCloseModal();
  };

  const handleCancelPublic = () => {
    setIsPublic(false);
    handleCloseModal();
  };

  const handleTogglePublic = () => {
    if (isPublic) {
      setIsPublic(false);
    } else {
      handleOpenModal();
    }
  };

  useEffect(() => {
    const loadProject = async () => {
      try {
        const projectData = await getProjectById(Number.parseInt(id)) // Fetch project by ID
        setProject(projectData)

        // Check if the idAdmin has the same program ID as the project
        if (user.user?.isAdmin?.includes(projectData.program.id)) {
          setIsDisabled(false);
        } else {
          setIsDisabled(true);
        }

        setIsPublic(projectData.isPublic); 

        const keywordList: Keyword[] = await getKeywordByProgramID(projectData.program.id); // Fetch keywords by program ID
        setKeywordList(keywordList); 

        // Fetch file blobs for existing resources
        const blobPromises = projectData?.projectResources
          ? projectData.projectResources
              .filter((resource) => resource.resourceType?.id === 1) // Only file type resources
              .map(async (resource) => {
                if (resource.url) {
                  try {
                    const response = await fetch(resource.url)
                    const blob = await response.blob()
                    return { id: resource.id, blob }
                  } catch (error) {
                    console.error(`Error fetching blob for resource ${resource.id}:`, error)
                    return null
                  }
                }
                return null
              })
          : []

        const blobs = await Promise.all(blobPromises)
        const blobMap = blobs.reduce(
          (acc, curr) => {
            if (curr) {
              acc[`file_blob_${curr.id}`] = curr.blob
            }
            return acc
          },
          {} as { [key: string]: Blob },
        )
        setFileBlobs(blobMap)

        // Initialize form data with existing URLs
        const initialFormData: FormData = {
          title_en: projectData.titleEN || "",
          title_th: projectData.titleTH,
          abstract_text: projectData.abstractText,
          isPublic: projectData.isPublic,
          academicYear: projectData.academicYear?.toString(),
          // courseNo: projectData.course?.courseNo,
          keywords: projectData.keywords?.map((keyword) => ({
            value: keyword.id,
            label: keyword.keyword,
          })),
          section: projectData.sectionId,
          semester: projectData.semester?.toString(),
          student: projectData.members.map((member) => ({
            value: typeof member.id === "string" ? Number.parseInt(member.id, 10) : member.id,
            label: `${member.firstName} ${member.lastName} (${member.studentId})`,
          })),
          advisor: projectData.staffs
            .filter((staff) => staff.projectRole.id === 1)
            .map((staff) => ({
              value: staff.id,
              label: `${staff.prefixEN} ${staff.firstNameEN} ${staff.lastNameEN} / ${staff.prefixTH} ${staff.firstNameTH} ${staff.lastNameTH}`,
            })),
          co_advisor: projectData.staffs
            .filter((staff) => staff.projectRole.id === 2)
            .map((staff) => ({
              value: staff.id,
              label: `${staff.prefixEN} ${staff.firstNameEN} ${staff.lastNameEN} / ${staff.prefixTH} ${staff.firstNameTH} ${staff.lastNameTH}`,
            })),
          committee: projectData.staffs
            .filter((staff) => staff.projectRole.id === 3)
            .map((staff) => ({
              value: staff.id,
              label: `${staff.prefixEN} ${staff.firstNameEN} ${staff.lastNameEN} / ${staff.prefixTH} ${staff.firstNameTH} ${staff.lastNameTH}`,
            })),
          external_committee: projectData.staffs
            .filter((staff) => staff.projectRole.id === 4)
            .map((staff) => ({
              value: staff.id,
              label: `${staff.prefixEN} ${staff.firstNameEN} ${staff.lastNameEN} / ${staff.prefixTH} ${staff.firstNameTH} ${staff.lastNameTH}`,
            })),
          ...blobMap,
        }

        // Add existing URLs to form data
        projectData.projectResources?.forEach((resource) => {
          if (resource.resourceType?.id === 2 && resource.url) {
            initialFormData[`file_link_${resource.id || resource.title}` as keyof FormData] = resource.url
          }
        })

        setFormData(initialFormData)

        // Always fetch resource configs for the program
        if (projectData?.program?.id) {
          const configs = await getProjectResourceConfig(projectData.program.id)
          setProjectResourceConfig(configs)
        }

        const employees = await getAllEmployees()
        const allPrograms = await getAllProgram()
        setPrograms(allPrograms)
        setStaffList(employees)

        const students = await getStudentsByProgram(projectData.program.id)
        setStudentList(students)

        const configs = await getProjectResourceConfig(projectData.program.id)
        setProjectResourceConfig(configs)
      } catch (error) {
        console.error("Error fetching project details:", error)
      } finally {
        setLoading(false)
      }
    }

   
    loadProject()
  }, [id, user.user?.isAdmin])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }

  const handleMultiSelectChange = (selectedOptions: { value: number; label: string }[], field: string) => {
    setFormData((prevData) => ({ ...prevData, [field]: selectedOptions }))
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const { files } = e.target
    if (files && files.length > 0) {
      const file = files[0]
      if (file.size > MAX_FILE_SIZE) {
        setFileErrors((prev) => ({
          ...prev,
          [fieldName]: `File size exceeds 25MB limit (Current size: ${(file.size / (1024 * 1024)).toFixed(2)}MB)`,
        }))
        e.target.value = "" // Reset file input
        return
      }
      const blob = new Blob([file], { type: file.type })
      setFormData((prevData) => ({
        ...prevData,
        [fieldName]: blob,
      }))
      // Clear any previous error for this field
      setFileErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[fieldName]
        return newErrors
      })
    }
  }

  const toggleEditMode = (resourceId: string) => {
    setEditModeResources((prev) => ({
      ...prev,
      [resourceId]: !prev[resourceId],
    }))
  }

  const renderInputField = (field: string, label: string, isRequired: boolean, type = "text") => (
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
  )

  const renderTextArea = (field: string, label: string, isRequired: boolean) => (
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
  )

  const renderFields = (fields: string[]) =>
    fields.map((field) => (
      <div key={field}>
        {field === "abstract_text"
          ? renderTextArea(field, labels[field], requiredFields.includes(field))
          : renderInputField(field, labels[field], requiredFields.includes(field))}
      </div>
    ))

  const renderMultiSelectField = (
    field: string,
    label: string,
    isRequired: boolean,
    optionsList: { value: number; label: string }[],
  ) => {
    // Only filter options for staff role fields (not for students)
    const staffRoleFields = ["advisor", "co_advisor", "committee", "external_committee"]
    let filteredOptions = [...optionsList]

    if (staffRoleFields.includes(field)) {
      // Get all currently selected staff across all roles except the current field
      const selectedStaffIds = staffRoleFields
        .filter((roleField) => roleField !== field)
        .flatMap((roleField) =>
          ((formData[roleField] as { value: number; label: string }[]) || []).map((staff) => staff.value),
        )

      // Filter out options that are already selected in other roles
      filteredOptions = optionsList.filter((option) => !selectedStaffIds.includes(option.value))
    }

    if(field === 'keywords'){
      // let filteredOptions = [...keywordList]

      const selectedKeywords = (formData[field] as { value: number; label: string }[]) || [] // Get selected keywords
      // Filter out selected keywords from the options
      const selectedKeywordIds = selectedKeywords.map((keyword) => keyword.value);
      filteredOptions = filteredOptions.filter((option) => !selectedKeywordIds.includes(option.value))

    }
    return (
      <div className="mb-4">
        <label className="block mb-1 text-sm font-medium text-gray-700">
          {label} {isRequired && <span className="text-red-500 ml-1">*</span>}
        </label>
        <Select
          isMulti
          name={field}
          value={(formData[field] as { value: number; label: string }[]) || []}
          onChange={(selectedOptions) =>
            handleMultiSelectChange(selectedOptions as { value: number; label: string }[], field)
          }
          options={filteredOptions}
          getOptionLabel={(e) => e.label}
          getOptionValue={(e) => e.value.toString()}
          className="w-full"
          isDisabled={isDisabled} // Set isDisabled based on the state
        />
      </div>
    )
  }

  const renderFileUploadSections = () => {
    // Get existing resources from project
    const existingResources = project?.projectResources || []

    // Get all available resource configs
    const availableConfigs = projectResourceConfig || []

    // Create a map of existing resources by title (case insensitive)
    const existingResourceMap = new Map(existingResources.map((resource) => [resource.title?.toLowerCase(), resource]))

    // Create a combined array of all resources to display
    const allResources = [
      // First add existing resources
      ...existingResources,
      // Then add configs that don't have matching existing resources
      ...availableConfigs.filter((config) => config.is_active && !existingResourceMap.has(config.title?.toLowerCase())),
    ]

    return allResources.map((resource) => {
      const isExistingResource = "url" in resource // Check if it's an existing resource
      const matchingConfig = projectResourceConfig.find(
        (config) => config.title?.toLowerCase() === resource.title?.toLowerCase(),
      )

      // Skip if it's a config resource that's not active
      if (!isExistingResource && !matchingConfig?.is_active) return null

      const isEditMode = editModeResources[resource.id?.toString() || resource.title || ""]
      const blobKey = `file_blob_${resource.id}`
      const hasExistingBlob = blobKey in fileBlobs

      return (
        <div
          key={resource.id || resource.title}
          className="p-4 mb-4 rounded-lg border border-gray-300 bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center">
                <div className="w-6 h-6 flex items-center justify-center">
                  <Image
                    src={
                      (matchingConfig?.icon_url ||
                        (isExistingResource && "icon_url" in resource ? resource.icon_url : undefined) ||
                        "/IconProjectBox/BlueBox.png") as string
                    }
                    alt={matchingConfig?.icon_name || resource.title || "Resource Icon"}
                    width={24}
                    height={24}
                    className="object-contain"
                    unoptimized
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold text-gray-900">{resource.title}</h3>
                  {isExistingResource && resource.url && (
                    <span className="text-sm font-medium text-green-600">(Uploaded)</span>
                  )}
                </div>
                {isExistingResource && resource.url && (
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
              onClick={() => toggleEditMode(resource.id?.toString() || resource.title || "")}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Edit resource"
            >
              <EditIcon className="text-gray-600 w-5 h-5" />
            </button>
          </div>

          {isEditMode && (
            <div className="mt-4 pl-13">
              {resource.title?.toLowerCase() === "pdf" || matchingConfig?.resource_type?.type_name === "file" ? (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Upload File {hasExistingBlob && "(Current file will be replaced)"}
                  </label>
                  <div className="text-xs text-red-500 mb-1">Maximum file size: 25MB</div>
                  <input
                    type="file"
                    accept=".pdf"
                    name={`file_upload_${resource.id || resource.title}`}
                    onChange={(e) => handleFileChange(e, `file_upload_${resource.id || resource.title}`)}
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
                  {fileErrors[`file_upload_${resource.id || resource.title}`] && (
                    <div className="text-sm text-red-500 mt-1">
                      {fileErrors[`file_upload_${resource.id || resource.title}`]}
                    </div>
                  )}
                  {hasExistingBlob && (
                    <div className="text-sm text-gray-600">
                      Current file is loaded and will be preserved unless you upload a new one
                    </div>
                  )}
                </div>
              ) : matchingConfig?.resource_type?.type_name === "url" ||
                (isExistingResource && "resourceType" in resource && resource.resourceType?.id === 2) ? (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Resource URL</label>
                  <input
                    type="text"
                    name={`file_link_${resource.id || resource.title}`}
                    value={(formData[`file_link_${resource.id || resource.title}`] as string) || ""}
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
                  <label className="block text-sm font-medium text-gray-700">Upload File</label>
                  <input
                    type="file"
                    name={`file_upload_${resource.id || resource.title}`}
                    onChange={(e) => handleFileChange(e, `file_upload_${resource.id || resource.title}`)}
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
      )
    })
  }

  const getStaffOptions = (staff: Advisor[]) => {
    return staff.map((staff) => {
      const programAbbr = programs.find((p) => p.id === staff.program_id)?.abbreviation || staff.program_id
      return {
        value: staff.id,
        label: `${programAbbr} / ${staff.prefix_en} ${staff.first_name_en} ${staff.last_name_en} / ${staff.prefix_th} ${staff.first_name_th} ${staff.last_name_th}`,
      }
    })
  }

  const handleSubmit = async () => {
    if (isSubmitting) return // Prevent duplicate submissions
    setIsSubmitting(true)
    try {
      const formDataToSend = new FormData()

      const projectData = {
        id: Number.parseInt(id, 10),
        project_no: project?.projectNo,
        title_th: formData.title_th,
        title_en: formData.title_en,
        abstract_text: formData.abstract_text,
        academic_year: Number.parseInt(formData.academicYear as string, 10),
        semester: Number.parseInt(formData.semester as string, 10),
        section_id: formData.section,
        keywords: formData.keywords?.map((keyword) => ({ id: keyword.value })) || [], 
        is_public: isPublic, // Add is_public field
        // course_id: project?.course?.id,
        program_id: project?.program?.id,
        staffs: [
          // Map advisor with role_id 1
          ...(formData.advisor
            ? (formData.advisor as { value: number; label: string }[]).map((advisor) => ({
                staff_id: advisor.value,
                project_role_id: 1,
              }))
            : []),
          // Map co-advisor with role_id 2
          ...(formData.co_advisor
            ? (formData.co_advisor as { value: number; label: string }[]).map((coAdvisor) => ({
                staff_id: coAdvisor.value,
                project_role_id: 2,
              }))
            : []),
          // Map committee with role_id 3
          ...(formData.committee
            ? (formData.committee as { value: number; label: string }[]).map((committee) => ({
                staff_id: committee.value,
                project_role_id: 3,
              }))
            : []),
          // Map external committee with role_id 4
          ...(formData.external_committee
            ? (formData.external_committee as { value: number; label: string }[]).map((externalCommittee) => ({
                staff_id: externalCommittee.value,
                project_role_id: 4,
              }))
            : []),
        ],
        members: formData.student
          ? (formData.student as { value: number; label: string }[]).map((student) => ({
              id: student.value,
            }))
          : [],
      }

      formDataToSend.append("project", JSON.stringify(projectData))

      // Get all resources (both existing and config)
      const existingResources = project?.projectResources || []
      const availableConfigs = projectResourceConfig || []

      // Create a map of existing resources by title
      const existingResourceMap = new Map(
        existingResources.map((resource) => [resource.title?.toLowerCase(), resource]),
      )

      // Combine all resources
      const allResources = [
        ...existingResources,
        ...availableConfigs.filter(
          (config) => config.is_active && !existingResourceMap.has(config.title?.toLowerCase()),
        ),
      ]

      // Process each resource
      allResources.forEach((resource) => {
        const isExistingResource = "url" in resource
        const resourceId = resource.id
        const resourceTitle = resource.title

        const linkField = `file_link_${resourceId || resourceTitle}`
        const fileField = `file_upload_${resourceId || resourceTitle}`
        const blobKey = `file_blob_${resourceId}`

        const matchingConfig = projectResourceConfig.find(
          (config) => config.title?.toLowerCase() === resource.title?.toLowerCase(),
        )

        const isPdfOrFileResource =
          resource.title?.toLowerCase() === "pdf" || matchingConfig?.resource_type?.type_name === "file"

        // Handle URL resources
        if (!isPdfOrFileResource) {
          // For URL resources, send either the new URL from form data or keep the existing URL
          const urlToSend = formData[linkField] || (isExistingResource ? resource.url : undefined)
          if (urlToSend) {
            formDataToSend.append(
              "projectResources[]",
              JSON.stringify({
                title: resourceTitle,
                url: urlToSend,
                resource_type_id: 2,
                ...(isExistingResource && { id: resourceId }),
              }),
            )
          }
        }

        // Handle file uploads - either new files or existing blobs
        const newFile = formData[fileField] as Blob | undefined
        const existingBlob = fileBlobs[blobKey]

        if (newFile || existingBlob) {
          formDataToSend.append(
            "projectResources[]",
            JSON.stringify({
              title: resourceTitle,
              resource_type_id: 1,
              ...(isExistingResource && { id: resourceId }),
            }),
          )

          // Append either the new file or the existing blob
          if (newFile) {
            formDataToSend.append("files", newFile)
          } else if (existingBlob) {
            formDataToSend.append("files", existingBlob)
          }
        }
      })      

      await updateProject(formDataToSend) // Call the updateProject function with the form data
      alert("Form submitted successfully!")
      router.push("/dashboard") // Redirect to dashboard page
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("Failed to submit the form.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) return <Spinner />
  if (!project) return <p>No project found.</p>

  return (
    <div className="flex flex-col min-h-screen bg-stone-100 py-6">
      <div className="container mx-auto max-w-3xl">
        <h6 className="mb-4 text-lg font-bold">Edit Project</h6>

        <div className="p-6 mb-6 rounded-lg border border-gray-300 bg-white">
          <h6 className="text-lg font-bold mb-4">Project Details</h6>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {renderFields([ "academicYear", "semester","section" ])}
          </div>
          {renderFields(["title_en", "title_th"])}
          {renderMultiSelectField("keywords", "Keywords", false, keywordList.map((keyword) => ({ value: keyword.id, label: keyword.keyword })))
}
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
            })),
          )}
          {renderMultiSelectField("advisor", "Advisor", true, getStaffOptions(staffList))}
          {renderMultiSelectField("co_advisor", "Co-Advisor", false, getStaffOptions(staffList))}
          {renderMultiSelectField("committee", "Committee Members", false, getStaffOptions(staffList))}
          {renderMultiSelectField(
            "external_committee",
            "External Committee Members",
            false,
            getStaffOptions(staffList),
          )}
        </div>

        <div className="p-6 mb-6 rounded-lg border border-gray-300 bg-white">
          <div className="flex justify-between items-center mb-6">
          <h6 className="text-lg font-bold mb-4">Uploads</h6>
          <div className="flex items-center">
            <Switch checked={isPublic} onChange={handleTogglePublic} />
            <span className="ml-2">{isPublic ? "Public" : "Make Public"}</span>
          </div>
          </div>
          {renderFileUploadSections()}
        </div>

        <div className="flex justify-end">
          
          <button
            onClick={handleSubmit}
            className={`bg-blue-500 text-white px-4 py-2 rounded ${isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"}`}
            disabled={isSubmitting}
          >
            Submit
          </button>
        </div>
      </div>
      {openModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg m-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Confirmation</h3>
                <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-4">This is to confirm that the document/project/information will be public.</p>
              <p className="text-sm text-gray-600 mb-4">ยืนยันว่าเอกสาร/โครงการ/ข้อมูลจะถูกเปิดเผยเป็นสาธารณะ</p>
              <div className="flex justify-end gap-3">
                <Button variant="contained" color="primary" onClick={handleConfirmPublic}>
                  Confirm
                </Button>
                <Button variant="outlined" color="secondary" onClick={handleCancelPublic}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EditProjectPage

