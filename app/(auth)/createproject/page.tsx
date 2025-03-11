"use client"
import type React from "react"
import { useEffect, useState } from "react"
import Spinner from "@/components/Spinner"
import getProjectConfig from "@/utils/configform/getProjectConfig"
import { getProjectResourceConfig } from "@/utils/configform/getProjectResourceConfig"
import getAllEmployees from "@/utils/advisorstats/getAllEmployee"
import type { Advisor } from "@/models/Advisor"
import Select from "react-select"
import Image from "next/image"
import { getConfigProgram } from "@/utils/configprogram/configProgram"
import { useAuth } from "@/hooks/useAuth"
import { getStudentInfo } from "@/utils/createproject/getStudentInfo" // Import the new utility function
import { getStudentsByProgram } from "@/utils/createproject/getStudentsByProgram"
import type { Student } from "@/models/Student" // Import the new Student type
import type { ConfigProgramSetting } from "@/models/ConfigProgram"
import axios from "axios" // Import axios for making API requests
import { useRouter } from "next/navigation" // Import useRouter from next/navigation
import { getProjectRoles } from "@/utils/createproject/getProjectRoles" // Import the getProjectRoles function
import type { ProjectRole } from "@/models/ProjectRoles" // Import the ProjectRole type
import type { ProjectResourceConfig } from "@/models/ProjectResourceConfig"
import getAllProgram from "@/utils/getAllProgram"
import type { AllProgram } from "@/models/AllPrograms"

// Types

interface FormConfig {
  [key: string]: boolean | ProjectResourceConfig[]
}

interface FormData {
  [key: string]: string | string[] | { url: string }[] | { value: number; label: string }[] | FileList | undefined
}

const CreateProject: React.FC = () => {
  const [formConfig, setFormConfig] = useState<FormConfig>({})
  const [formData, setFormData] = useState<FormData>({})
  const [loading, setLoading] = useState(true)
  const [staffList, setStaffList] = useState<Advisor[]>([])
  const [studentList, setStudentList] = useState<Student[]>([]) // Store student list
  const [configProgram, setConfigProgram] = useState<ConfigProgramSetting[]>([])
  const [data, setData] = useState<Student | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [projectRoles, setProjectRoles] = useState<ProjectRole[]>([]) // Store project roles
  const [programs, setPrograms] = useState<AllProgram[]>([])
  const [fileErrors, setFileErrors] = useState<{ [key: string]: string }>({})
  const MAX_FILE_SIZE = 25 * 1024 * 1024 // 25MB in bytes

  const { user } = useAuth() // Get user from useAuth
  const router = useRouter() // Initialize useRouter

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
    upload_section: "Upload Section",
  }

  const requiredFields: string[] = ["course_id", "title_en", "title_th", "student", "advisor", "upload_section"]

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.studentId) return // Ensure studentId is available

      try {
        // Fetch student data using the studentId from useAuth
        const data = await getStudentInfo(user.studentId)
        setData(data)

        if (data?.program_id) {
          const config = await getProjectConfig(data.program_id) // Use program ID from student data
          const activeFields = config.reduce<FormConfig>((acc, field) => {
            if (field.is_active) acc[field.title] = true
            return acc
          }, {})
          setFormConfig(activeFields)

          const projectResourceConfigs = await getProjectResourceConfig(data.program_id) // Use program ID from student data
          setFormConfig((prevConfig) => ({
            ...prevConfig,
            upload_section: projectResourceConfigs,
          }))

          const employees = await getAllEmployees()
          const allPrograms = await getAllProgram()
          setPrograms(allPrograms)
          setStaffList(employees)

          const students = await getStudentsByProgram(data.program_id) // Use program ID from student data
          setStudentList(students)

          // Auto-select current student if found in the student list
          const currentStudent = students.find((student) => student.student_id === user.studentId)
          if (currentStudent) {
            setFormData((prevData) => ({
              ...prevData,
              student: [
                {
                  value: currentStudent.id,
                  label: `${currentStudent.first_name} ${currentStudent.last_name} (${currentStudent.student_id})`,
                },
              ],
            }))
          }

          const programConfig = await getConfigProgram(data.program_id) // Fetch program config
          setConfigProgram(programConfig)

          const roles = await getProjectRoles() // Fetch project roles
          setProjectRoles(roles)

          // Pre-fill course and section
          setFormData((prevData) => ({
            ...prevData,
            course_id: data.course.course_no,
            section_id: data.sec_lab,
          }))
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user?.studentId]) // Re-run effect when studentId changes

  // Prefill academic year and semester
  useEffect(() => {
    if (configProgram.length > 0) {
      const prefilledData: Partial<FormData> = {}

      configProgram.forEach((config) => {
        if (formConfig[config.config_name.replace(" ", "_")]) {
          prefilledData[config.config_name.replace(" ", "_")] = config.value
        }
      })

      setFormData((prevData) => ({
        ...prevData,
        ...prefilledData,
      }))
    }
  }, [configProgram, formConfig])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }

  const handleMultiSelectChange = (selectedOptions: { value: number; label: string }[], field: string) => {
    setFormData((prevData) => {
      const newData = { ...prevData, [field]: selectedOptions }

      // Only apply validation for advisor roles, not for students
      if (field === "student") {
        return newData
      }

      // If this is an advisor role, check for duplicates in other roles
      const advisorRoles = ["advisor", "co_advisor", "committee", "external_committee"]
      const selectedValues = new Set(selectedOptions.map((option) => option.value))

      // For each advisor role that's not the current field
      advisorRoles.forEach((role) => {
        if (role !== field) {
          const currentRoleSelections = (newData[role] as { value: number; label: string }[]) || []

          // Filter out any options that are now selected in the current field
          const filteredSelections = currentRoleSelections.filter((option) => !selectedValues.has(option.value))

          // Update the data if we removed any duplicates
          if (filteredSelections.length !== currentRoleSelections.length) {
            newData[role] = filteredSelections
          }
        }
      })

      return newData
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
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
      // Save the FileList directly instead of blob URLs
      setFormData((prevData) => ({
        ...prevData,
        [fieldName]: files,
      }))
      // Clear any previous error for this field
      setFileErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[fieldName]
        return newErrors
      })
    }
  }

  const renderInputField = (field: string, label: string, isRequired: boolean, type = "text") => {
    if (!formConfig[field]) return null

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
    )
  }

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
    fields.map((field) => {
      if (formConfig[field]) {
        return (
          <div key={field}>
            {field === "abstract_text"
              ? renderTextArea(field, labels[field], requiredFields.includes(field))
              : renderInputField(field, labels[field], requiredFields.includes(field))}
          </div>
        )
      }
      return null
    })

  const renderMultiSelectField = (
    field: string,
    label: string,
    isRequired: boolean,
    optionsList: { value: number; label: string }[],
  ) => {
    if (!formConfig[field]) return null

    // Only apply filtering for advisor roles, not for students
    let filteredOptions = optionsList

    if (field !== "student") {
      // Get all selected staff across all advisor roles
      const selectedAdvisors = (formData.advisor as { value: number; label: string }[]) || []
      const selectedCoAdvisors = (formData.co_advisor as { value: number; label: string }[]) || []
      const selectedCommittee = (formData.committee as { value: number; label: string }[]) || []
      const selectedExternalCommittee = (formData.external_committee as { value: number; label: string }[]) || []

      // Create a set of all selected staff IDs except for the current field
      const selectedStaffIds = new Set<number>()

      if (field !== "advisor") {
        selectedAdvisors.forEach((item) => selectedStaffIds.add(item.value))
      }
      if (field !== "co_advisor") {
        selectedCoAdvisors.forEach((item) => selectedStaffIds.add(item.value))
      }
      if (field !== "committee") {
        selectedCommittee.forEach((item) => selectedStaffIds.add(item.value))
      }
      if (field !== "external_committee") {
        selectedExternalCommittee.forEach((item) => selectedStaffIds.add(item.value))
      }

      // Filter out options that are already selected in other roles
      filteredOptions = optionsList.filter((option) => !selectedStaffIds.has(option.value))
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
        />
      </div>
    )
  }

  const renderFileUploadSections = () => {
    const fileConfigs = formConfig["upload_section"] as ProjectResourceConfig[] | undefined

    if (!fileConfigs) return null

    return fileConfigs.map((fileConfig) => {
      if (!fileConfig.is_active) return null

      return (
        <div key={fileConfig.id} className="p-4 mb-4 rounded-lg border border-gray-300 bg-white">
          <div className="flex items-center mb-4">
            {fileConfig.icon_name ? (
              <div className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center">
                <div className="w-7 h-7 flex items-center justify-center">
                  <Image
                    src={fileConfig.icon_url || "/IconProjectBox/BlueBox.png"}
                    alt="icon"
                    width={32}
                    height={32}
                    style={{ objectFit: "contain" }}
                    className="w-full h-full object-contain"
                    unoptimized
                  />
                </div>
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">N/A</div>
            )}
            <h6 className="text-lg font-bold ml-2">{fileConfig.title}</h6>
          </div>

          {fileConfig.resource_type.type_name === "url" ? (
            <div>
              <label className="block text-sm font-semibold mb-2">Paste Link</label>
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
              <label className="block text-sm font-semibold mb-2">Upload File</label>
              <div className="text-xs text-red-500 mb-1">Maximum file size: 25MB</div>
              <input
                type="file"
                name={`file_upload_${fileConfig.id}`}
                onChange={(e) => handleFileChange(e, `file_upload_${fileConfig.id}`)}
                className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
              />
              {fileErrors[`file_upload_${fileConfig.id}`] && (
                <div className="text-sm text-red-500 mt-1">{fileErrors[`file_upload_${fileConfig.id}`]}</div>
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
    if (isSubmitting) return

    // Check required fields
    const missingFields = requiredFields.filter((field) => {
      if (field === "advisor" || field === "student") {
        return !formData[field] || (formData[field] as { value: number; label: string }[]).length === 0
      }
      if (field === "upload_section") {
        const fileConfigs = formConfig["upload_section"] as ProjectResourceConfig[] | undefined
        if (!fileConfigs) return true

        // Check if at least one file or URL is provided for active configs
        return !fileConfigs.some((config) => {
          if (!config.is_active) return true
          const linkField = `file_link_${config.id}`
          const fileField = `file_upload_${config.id}`
          return formData[linkField] || (formData[fileField] as FileList)?.length > 0
        })
      }
      return !formData[field] || (formData[field] as string).trim() === ""
    })

    if (missingFields.length > 0) {
      const missingFieldLabels = missingFields.map((field) => labels[field]).join(", ")
      alert(`Please fill in all required fields: ${missingFieldLabels}`)
      return
    }

    setIsSubmitting(true)
    try {
      const formDataToSend = new FormData()

      const projectData = {
        title_th: formData.title_th,
        title_en: formData.title_en,
        abstract_text: formData.abstract_text,
        academic_year: Number.parseInt(formData.academic_year as string, 10),
        semester: Number.parseInt(formData.semester as string, 10),
        section_id: formData.section_id,
        program_id: data?.program_id,
        course_id: data?.course_id,
        staffs: [
          ...(formData.advisor
            ? (formData.advisor as { value: number; label: string }[]).map((advisor) => ({
                staff_id: advisor.value,
                project_role_id: projectRoles.find((role) => role.role_name_en === "Advisor")?.id || 1,
              }))
            : []),
          ...(formData.co_advisor
            ? (formData.co_advisor as { value: number; label: string }[]).map((coAdvisor) => ({
                staff_id: coAdvisor.value,
                project_role_id: projectRoles.find((role) => role.role_name_en === "Co-Advisor")?.id || 2,
              }))
            : []),
          ...(formData.committee
            ? (formData.committee as { value: number; label: string }[]).map((committee) => ({
                staff_id: committee.value,
                project_role_id: projectRoles.find((role) => role.role_name_en === "Committee")?.id || 3,
              }))
            : []),
          ...(formData.external_committee
            ? (formData.external_committee as { value: number; label: string }[]).map((externalCommittee) => ({
                staff_id: externalCommittee.value,
                project_role_id:
                  projectRoles.find((role) => role.role_name_en === "External Committee Members")?.id || 4,
              }))
            : []),
        ],
        members: (formData.student as { value: number; label: string }[]).map((student) => ({
          id: student.value,
        })),
      }

      // 3. Append the JSON-serialized project object.
      formDataToSend.append("project", JSON.stringify(projectData))

      // 4. For each ProjectResourceConfig, decide if we have a URL or a file upload.
      const fileConfigs = formConfig["upload_section"] as ProjectResourceConfig[] | undefined
      if (fileConfigs) {
        fileConfigs.forEach((fileConfig) => {
          if (!fileConfig.is_active) return // skip if inactive

          // If the user entered a link (URL-based resource)
          const linkField = `file_link_${fileConfig.id}`
          const fileField = `file_upload_${fileConfig.id}`

          // If there's a text link, append it as a resource
          if (formData[linkField]) {
            formDataToSend.append(
              "projectResources[]",
              JSON.stringify({
                title: fileConfig.title,
                url: formData[linkField],
              }),
            )
          }

          // If the user selected files, append them
          const selectedFiles = formData[fileField] as FileList | undefined
          if (selectedFiles && selectedFiles.length > 0) {
            // First, append the resource metadata (e.g., just the title)
            formDataToSend.append(
              "projectResources[]",
              JSON.stringify({
                title: fileConfig.title,
              }),
            )

            // Then, each file in the FileList must be appended as a separate form-data part
            Array.from(selectedFiles).forEach((file) => {
              formDataToSend.append("files", file, file.name)
            })
          }
        })
      }

      // 5. Send the formData using axios
      await axios.post("https://project-service.kunmhing.me/api/v1/projects", formDataToSend, {
        headers: {
          Authorization:
            "Bearer Pl6sXUmjwzNtwcA4+rkBP8jTmRttcNwgJqp1Zn1a+qCRaYXdYdwgJ9mM5glzHQD2FOsLilpELbmVSF2nGZCOwTO6u5CTsVpyIGDguXoMobSApgEsO3avovqWYDAEuznY/Vu4XMvHDkFqyuY1dQfN+QdB04t89/1O/w1cDnyilFU=",
          "Content-Type": "multipart/form-data",
        },
      })

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

  return (
    <div className="flex flex-col min-h-screen bg-stone-100 py-6">
      <div className="container mx-auto max-w-3xl">
        <h6 className="mb-4 text-lg font-bold">Create Project</h6>
        <div className="p-6 mb-6 rounded-lg border border-gray-300 bg-white">
          <h6 className="text-lg font-bold mb-4">Project Details</h6>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {renderFields(["course_id", "section_id", "semester", "academic_year"])}
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
          <h6 className="text-lg font-bold mb-4">Uploads</h6>
          {renderFileUploadSections()}
        </div>
        <button
          onClick={handleSubmit}
          className={`bg-blue-500 text-white px-4 py-2 rounded ${isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"}`}
          disabled={isSubmitting}
        >
          Submit
        </button>
      </div>
    </div>
  )
}

export default CreateProject

