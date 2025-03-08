// components/FlowbiteNavbar.tsx
"use client";
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import HamburgerIcon from "@/public/Svg/HamburgerIcon";
import Image from "next/image";

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
              <HamburgerIcon />
            </button>
            <a href="#" className="flex items-center ms-2 md:me-24">
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
            </a>
          </div>
          <div className="flex items-center">
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
              {/* Profile Icon Section (Optional, uncomment if needed) */}
              {/* <div className="ml-4">
                <button
                  type="button"
                  className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300"
                  aria-expanded="false"
                  data-dropdown-toggle="dropdown-user"
                >
                  <span className="sr-only">Open user menu</span>
                  <Image
                    className="w-8 h-8 rounded-full bg-white" // Added bg-white class
                    src="/boy.png"
                    alt={""}
                    width={24} // Specify width (in px)
                    height={24} // Specify height (in px)
                  />
                </button>
              </div> */}
              <div className="ml-4">
                <button
                  type="button"
                  className="flex text-sm bg-black rounded-full focus:ring-4 focus:ring-gray-300 border-2 border-black"
                  aria-expanded="false"
                  data-dropdown-toggle="dropdown-user"
                >
                  <span className="sr-only">Open user menu</span>
                  {/* User Initials */}
                  <div className="w-8 h-8 flex items-center justify-center bg-white text-gray-800 font-bold rounded-full">
                    {/* Replace 'A' with the first 2  character of the user's name */}
                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                    {/* {user?.firstName?.charAt(0 )} */}

                  </div>
                </button>
            </div>

            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
