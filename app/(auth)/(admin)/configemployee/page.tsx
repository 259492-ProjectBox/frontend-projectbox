"use client";
import React, { useEffect, useState } from "react";
import { Advisor } from "@/models/Advisor";
import Spinner from "@/components/Spinner";
import postCreateEmployee from "@/utils/configemployee/postCreateEmployee";
import getEmployeeByProgramId from "@/utils/advisorstats/getEmployeebyProgramId";
import putUpdateEmployee from "@/utils/configemployee/putEditEmployee";
import { useAuth } from "@/hooks/useAuth";
import { AllProgram } from "@/models/AllPrograms";
import { getProgramOptions } from "@/utils/programHelpers";

export default function ConfigAdvisorPage() {
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Modal & form states
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [selectedAdvisor, setSelectedAdvisor] = useState<Advisor | null>(null);

  const [prefixEn, setPrefixEn] = useState<string>("");
  const [prefixTh, setPrefixTh] = useState<string>("");
  const [firstNameEn, setFirstNameEn] = useState<string>("");
  const [firstNameTh, setFirstNameTh] = useState<string>("");
  const [lastNameEn, setLastNameEn] = useState<string>("");
  const [lastNameTh, setLastNameTh] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string | null>(null);

  // Major selector states
  const [selectedMajor, setSelectedMajor] = useState<number>(0);
  const [options, setOptions] = useState<AllProgram[]>([]);

  useEffect(() => {
    const fetchOptions = async () => {
      if(!user) return;
      const programOptions = await getProgramOptions(user.isAdmin);
      setOptions(programOptions);

      // Ensure selectedMajor is in options, otherwise set it to "Unknown" (0)
      const validIds = programOptions.map((option) => option.id);
      if (!validIds.includes(selectedMajor)) {
        setSelectedMajor(0);
      }
    };

    fetchOptions();
  }, [user?.isAdmin]);
  // Fetch advisors by selected major ID
  useEffect(() => {
    const fetchAdvisors = async () => {
      setLoading(true);
      try {
        const data: Advisor[] = await getEmployeeByProgramId(selectedMajor);
        setAdvisors(data);
      } catch (err) {
        console.error("Error fetching advisors:", err);
        setError("Failed to load advisors.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchAdvisors();
  }, [selectedMajor]);

  // Handler for opening the modal (edit or add mode)
  const handleOpenModal = (advisor: Advisor | null = null) => {
    setIsEditMode(!!advisor);
    setSelectedAdvisor(advisor);

    if (advisor) {
      setPrefixEn(advisor.prefix_en);
      setPrefixTh(advisor.prefix_th);
      setFirstNameEn(advisor.first_name_en);
      setFirstNameTh(advisor.first_name_th);
      setLastNameEn(advisor.last_name_en);
      setLastNameTh(advisor.last_name_th);
      setEmail(advisor.email);
    } else {
      setPrefixEn("");
      setPrefixTh("");
      setFirstNameEn("");
      setFirstNameTh("");
      setLastNameEn("");
      setLastNameTh("");
      setEmail("");
    }

    setIsModalOpen(true);
  };

  // Save (create or update) advisor
  const handleSaveAdvisor = async () => {
    if (!email || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      setEmailError("Enter a valid CMU account");
      return;
    }
    setEmailError(null);
    try {
      if (isEditMode && selectedAdvisor) {
        // Update existing advisor
        const updatedAdvisor = {
          ...selectedAdvisor,
          prefix_en: prefixEn,
          prefix_th: prefixTh,
          first_name_en: firstNameEn,
          first_name_th: firstNameTh,
          last_name_en: lastNameEn,
          last_name_th: lastNameTh,
          email,
        };
        const updatedEmployee = await putUpdateEmployee(updatedAdvisor);
        setAdvisors((prev) =>
          prev.map((advisor) =>
            advisor.id === selectedAdvisor.id ? updatedEmployee : advisor
          )
        );
        alert("Advisor updated successfully!");
      } else {
        // Create new advisor
        const newAdvisorPayload = {
          prefix_en: prefixEn,
          prefix_th: prefixTh,
          first_name_en: firstNameEn,
          first_name_th: firstNameTh,
          last_name_en: lastNameEn,
          last_name_th: lastNameTh,
          email,
          program_id: selectedMajor,
        };
        const newAdvisor = await postCreateEmployee(newAdvisorPayload);
        setAdvisors((prev) => [...prev, newAdvisor]);
        alert("Advisor created successfully!");
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error saving advisor:", err);
      alert("Failed to save advisor.");
    }
  };

  // Display loading or error states
  if (loading) return <Spinner />;
  if (error) {
    return (
      <div className="min-h-screen p-4 bg-gray-100 flex items-center justify-center">
        <p className="text-primary_text">{error}</p>
      </div>
    );
  }

  // Main layout
  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow p-6">
        {/* Container for Program selector */}
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
             focus:outline-none focus:ring-2 focus:ring-red-900"
          >
            {options.map((option) => (
              <option key={option.id} value={option.id}>
                {option.program_name_en}
              </option>
            ))  
            }
          </select>
        </div>

        {/* Header + Add Staff Button */}
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-lg font-semibold text-gray-800">
            Config Advisor
          </h1>
          <button
            onClick={() => handleOpenModal()}
            className="px-4 py-2 bg-primary_button text-white font-medium rounded 
                       hover:bg-button_hover focus:outline-none focus:ring-2 focus:ring-button_focus"
          >
            Add Advisor
          </button>
        </div>

        {/* Modal for Add/Edit Advisor */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-sm">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                {isEditMode ? "Edit Advisor" : "Add New Advisor"}
              </h2>

              {/* English Section */}
              <div className="mb-4 p-3 border border-gray-200 rounded">
                <h3 className="text-md font-semibold text-gray-700 mb-2">
                  English
                </h3>
                <div className="mb-2">
                  <label
                    htmlFor="prefixEn"
                    className="text-sm text-gray-700 block mb-1"
                  >
                    Position (EN)
                  </label>
                  <input
                    id="prefixEn"
                    type="text"
                    value={prefixEn}
                    onChange={(e) => setPrefixEn(e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm
                               focus:outline-none focus:ring-2 focus:ring-red-900
                               focus:border-transparent"
                  />
                </div>
                <div className="mb-2">
                  <label
                    htmlFor="firstNameEn"
                    className="text-sm text-gray-700 block mb-1"
                  >
                    First Name (EN)
                  </label>
                  <input
                    id="firstNameEn"
                    type="text"
                    value={firstNameEn}
                    onChange={(e) => setFirstNameEn(e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm
                               focus:outline-none focus:ring-2 focus:ring-button_primary
                               focus:border-transparent"
                  />
                </div>
                <div className="mb-2">
                  <label
                    htmlFor="lastNameEn"
                    className="text-sm text-gray-700 block mb-1"
                  >
                    Last Name (EN)
                  </label>
                  <input
                    id="lastNameEn"
                    type="text"
                    value={lastNameEn}
                    onChange={(e) => setLastNameEn(e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm
                               focus:outline-none focus:ring-2 focus:ring-button_focus
                               focus:border-transparent"
                  />
                </div>
              </div>

              {/* Thai Section */}
              <div className="mb-4 p-3 border border-gray-200 rounded">
                <h3 className="text-md font-semibold text-gray-700 mb-2">
                  Thai
                </h3>
                <div className="mb-2">
                  <label
                    htmlFor="prefixTh"
                    className="text-sm text-gray-700 block mb-1"
                  >
                    ตำแหน่ง (TH)
                  </label>
                  <input
                    id="prefixTh"
                    type="text"
                    value={prefixTh}
                    onChange={(e) => setPrefixTh(e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm
                               focus:outline-none focus:ring-2 focus:ring-red-900
                               focus:border-transparent"
                  />
                </div>
                <div className="mb-2">
                  <label
                    htmlFor="firstNameTh"
                    className="text-sm text-gray-700 block mb-1"
                  >
                    ชื่อจริง (TH)
                  </label>
                  <input
                    id="firstNameTh"
                    type="text"
                    value={firstNameTh}
                    onChange={(e) => setFirstNameTh(e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm
                               focus:outline-none focus:ring-2 focus:ring-button_primary
                               focus:border-transparent"
                  />
                </div>
                <div className="mb-2">
                  <label
                    htmlFor="lastNameTh"
                    className="text-sm text-gray-700 block mb-1"
                  >
                    นามสกุล (TH)
                  </label>
                  <input
                    id="lastNameTh"
                    type="text"
                    value={lastNameTh}
                    onChange={(e) => setLastNameTh(e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm
                               focus:outline-none focus:ring-2 focus:ring-button_focus
                               focus:border-transparent"
                  />
                </div>
              </div>

              {/* Email Section */}
              <div className="mb-3">
                <label
                  htmlFor="email"
                  className="text-sm text-gray-700 block mb-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm
                             focus:outline-none focus:ring-2 focus:ring-button_focus
                             focus:border-transparent"
                />
                {emailError && <p className="text-red-600 text-sm mt-1">{emailError}</p>}
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1 bg-gray-300 text-gray-700 rounded
                             hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveAdvisor}
                  className="px-3 py-1 bg-primary_button text-white rounded hover:bg-button_hover"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Table of Advisors */}
        {loading ? (
          <Spinner />
        ) : (
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-6">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Email
                  </th>
                  <th scope="col" className="px-3 py-3 text-center w-24">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {advisors && advisors.length > 0 ? (
                  advisors.map((item) => (
                    <tr
                      key={item.id}
                      className="bg-white border-b hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {item.id}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {item.prefix_en} {item.first_name_en}{" "}
                        {item.last_name_en}
                      </td>
                      <td className="px-6 py-4">{item.email}</td>
                      <td className="px-3 py-4 text-center">
                        <button
                          onClick={() => handleOpenModal(item)}
                          className="text-blue-600 hover:underline"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No Data
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
