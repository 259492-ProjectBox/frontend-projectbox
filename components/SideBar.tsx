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
    { text: "My Project", icon: <PersonIcon />, path: "/dashboard" },
    { text: "Search Project", icon: <SearchIcon />, path: "/search" },
    { text: "Advisor Stats", icon: <GroupsIcon />, path: "/advisorstats" },
    { text: "Assets", icon: <InventoryIcon />, path: "/assetspage" },
    { text: "Event Calendar", icon: <EventIcon />, path: "/eventcalendar" },
  ];

  const configMenuItems = [
    { text: "Config Form", icon: <SettingsIcon />, path: "/configform" },
    { text: "Config Calendar", icon: <SettingsIcon />, path: "/configcalendar" },
    { text: "Config Advisor", icon: <SettingsIcon />, path: "/configadvisor" },
    { text: "Admin Manage", icon: <SupervisorAccountIcon />, path: "/adminmanage" },
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
        className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform bg-white border-r border-gray-200 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto">
          <ul className="space-y-2 font-medium">
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
          <ul className="space-y-2 font-medium">
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
                <LogoutIcon />
              </div>
              <span className="ml-3">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Content Area */}
      <main className="flex-grow p-4 mt-16 sm:ml-64">{children}</main>
    </div>
  );
}
