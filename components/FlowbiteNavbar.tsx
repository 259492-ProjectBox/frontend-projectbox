// components/FlowbiteNavbar.tsx
"use client";
import React from "react";
import { useAuth } from "@/hooks/useAuth";

export default function FlowbiteNavbar({
  toggleSidebar,
}: {
  toggleSidebar: () => void;
}) {
  const { user } = useAuth();

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
              <svg
                className="w-6 h-6"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clipRule="evenodd"
                  fillRule="evenodd"
                  d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                ></path>
              </svg>
            </button>
            <a href="#" className="flex ms-2 md:me-24">
              <span className="self-center text-xl font-semibold whitespace-nowrap">
                CMU ENG Project
              </span>
            </a>
          </div>
          <div className="flex items-center">
            <div className="flex items-center ms-3">
              <div className="text-sm">
                {/* User Details */}
                <div className="flex items-center">
                  <p className="font-semibold text-gray-800">
                    {user?.firstName} {user?.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">{user?.studentId}</p>
                </div>
              </div>
              {/* Profile Icon Section (Optional, uncomment if needed) */}
              <div className="ml-4">
                <button
                  type="button"
                  className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300"
                  aria-expanded="false"
                  data-dropdown-toggle="dropdown-user"
                >
                  <span className="sr-only">Open user menu</span>
                  <img
                    className="w-8 h-8 rounded-full"
                    src="https://www.w3schools.com/w3images/avatar2.png" // Changed to a generic guest profile picture
                    alt="guest user"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
