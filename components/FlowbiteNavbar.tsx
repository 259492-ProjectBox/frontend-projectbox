"use client";
import type React from "react";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import HamburgerIcon from "@/public/Svg/HamburgerIcon";
import Image from "next/image";
import LogoutIcon from "@mui/icons-material/Logout";
import { useRouter } from "next/navigation";
import { useProgram } from "@/context/ProgramContext";

export default function FlowbiteNavbar({
  toggleSidebar,
}: {
  toggleSidebar: () => void;
}) {
  const { user, signOut } = useAuth();
  const { selectedMajor, setSelectedMajor, options } = useProgram();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleNavigateToDashboard = () => {
    router.push("/dashboard");
  };

  const handleMajorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMajor = Number(e.target.value);
    setSelectedMajor(newMajor);
  };

  return (
    <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start">
            <button
              onClick={toggleSidebar}
              type="button"
              className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              <span className="sr-only">Open sidebar</span>
              <HamburgerIcon />
            </button>
            <button
              onClick={handleNavigateToDashboard}
              className="flex items-center ms-2 md:me-24 hover:opacity-80 transition-opacity"
            >
              <Image
                src="/IconProjectBox/BlueBox.png"
                alt="CMU Logo"
                width={30}
                height={30}
                className="mr-2"
              />
              <span className="self-center text-xl font-semibold whitespace-nowrap">
                CMU ENG PROJECT
              </span>
            </button>
          </div>
          <div className="flex items-center">
            {/* Program Selection Dropdown */}
            {Array.isArray(user?.isAdmin) && user.isAdmin.length > 0 && (
              <div className="mr-4">
                <select
                  value={selectedMajor}
                  onChange={handleMajorChange}
                  className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-primary-light transition-colors"
                >
                  {options.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.program_name_en}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex items-center justify-end ms-3">
              <div className="text-sm text-right">
                {/* User Details */}
                <div className="flex flex-col">
                  <p className="font-semibold text-gray-800">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-gray-600">{user?.studentId}</p>
                </div>
              </div>
              <div className="ml-4 relative" ref={dropdownRef}>
                <button
                  type="button"
                  className="flex text-sm bg-black rounded-full focus:ring-4 focus:ring-gray-300 border-2 border-black"
                  onClick={toggleDropdown}
                >
                  <span className="sr-only">Open user menu</span>
                  {/* User Initials */}
                  <div className="w-8 h-8 flex items-center justify-center bg-white text-gray-800 font-bold rounded-full">
                    {user?.firstName?.charAt(0)}
                    {user?.lastName?.charAt(0)}
                  </div>
                </button>
                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-100">
                    <button
                      onClick={signOut}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <LogoutIcon className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
