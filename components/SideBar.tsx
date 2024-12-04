// components/Sidebar.tsx
"use client";
import * as React from "react";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import FlowbiteNavbar from "./FlowbiteNavbar";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import GroupsIcon from "@mui/icons-material/Groups";
import LogoutIcon from "@mui/icons-material/Logout";
import InventoryIcon from "@mui/icons-material/Inventory";
import EventIcon from "@mui/icons-material/Event";
import SettingsIcon from "@mui/icons-material/Settings";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";

export default function Sidebar({ children }: React.PropsWithChildren) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { signOut } = useAuth();

  const menuItems = [
    { text: "My Project", icon: <PersonIcon className="w-4 h-4" />, path: "/dashboard" },
    { text: "Search Project", icon: <SearchIcon className="w-4 h-4" />, path: "/search" },
    { text: "Advisor Stats", icon: <GroupsIcon className="w-4 h-4" />, path: "/advisorstats" },
    { text: "Assets", icon: <InventoryIcon className="w-4 h-4" />, path: "/assetspage" },
    { text: "Event Calendar", icon: <EventIcon className="w-4 h-4" />, path: "/eventcalendar" },
  ];

  const configMenuItems = [
    { text: "Config Form", icon: <SettingsIcon className="w-4 h-4" />, path: "/configform" },
    { text: "Config Calendar", icon: <SettingsIcon className="w-4 h-4" />, path: "/configcalendar" },
    { text: "Config Advisor", icon: <SettingsIcon className="w-4 h-4" />, path: "/configadvisor" },
    { text: "Admin Manage", icon: <SupervisorAccountIcon className="w-4 h-4" />, path: "/adminmanage" },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex">
      {/* Navbar */}
      <FlowbiteNavbar toggleSidebar={toggleSidebar} />

      {/* Sidebar */}
      <aside
        id="logo-sidebar"
        className={`fixed top-0 left-0 z-40 w-52 h-screen pt-20 transition-transform bg-white border-r border-gray-200 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto">
          <ul className="space-y-2 font-medium text-sm"> {/* Decreased text size to 'text-sm' */}
            {menuItems.map((item) => (
              <li key={item.text}>
                <button
                  onClick={() => router.push(item.path)}
                  className={`flex items-center w-full p-2 rounded-lg hover:bg-gray-100 ${
                    pathname === item.path ? "bg-gray-200" : ""
                  }`}
                >
                  <div className="text-gray-500 group-hover:text-gray-900">
                    {item.icon}
                  </div>
                  <span className="ml-3">{item.text}</span>
                </button>
              </li>
            ))}
          </ul>

          {/* Divider */}
          <hr className="my-4 border-gray-300" />

          {/* Config Section */}
          <ul className="space-y-2 font-medium text-sm"> {/* Decreased text size to 'text-sm' */}
            {configMenuItems.map((item) => (
              <li key={item.text}>
                <button
                  onClick={() => router.push(item.path)}
                  className={`flex items-center w-full p-2 rounded-lg hover:bg-gray-100 ${
                    pathname === item.path ? "bg-gray-200" : ""
                  }`}
                >
                  <div className="text-gray-500 group-hover:text-gray-900">
                    {item.icon}
                  </div>
                  <span className="ml-3">{item.text}</span>
                </button>
              </li>
            ))}
          </ul>

          {/* Logout Section */}
          <div className="mt-4">
            <button
              onClick={signOut}
              className="flex items-center w-full p-2 rounded-lg hover:bg-gray-100"
            >
              <div className="text-gray-500 group-hover:text-gray-900">
                <LogoutIcon className="w-4 h-4" /> {/* Decreased icon size */}
              </div>
              <span className="ml-3 text-sm">Logout</span> {/* Decreased text size */}
            </button>
          </div>
        </div>
      </aside>

      {/* Content Area */}
      <main className="flex-grow mt-16 sm:ml-52">{children}</main>
    </div>
  );
}
