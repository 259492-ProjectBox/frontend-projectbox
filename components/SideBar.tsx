"use client";
import * as React from "react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import FlowbiteNavbar from "./FlowbiteNavbar";
import SidebarMenuSection from "./sidebar/SidebarMenuSection";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import GroupsIcon from "@mui/icons-material/Groups";
import ChecklistRtlIcon from "@mui/icons-material/ChecklistRtl";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import EditNoteIcon from "@mui/icons-material/EditNote";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import KeyIcon from '@mui/icons-material/Key';

export default function Sidebar({ children }: React.PropsWithChildren) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();

  const menuItems = [
    { text: "My Project", icon: <PersonIcon className="w-4 h-4 text-blue-500" />, path: "/dashboard" },
    { text: "Search Project", icon: <SearchIcon className="w-4 h-4 text-teal-500" />, path: "/search" },
    { text: "Advisor Info", icon: <GroupsIcon className="w-4 h-4 text-red-500" />, path: "/advisorstats" },
    // { text: "Event Calendar", icon: <EventIcon className="w-4 h-4 text-red-500" />, path: "/eventcalendar" },
    // { text: "Assets", icon: <InventoryIcon className="w-4 h-4 text-orange-500" />, path: "/assetspage" },
  ];

  const configMenuItems = [
    { text: "Manage Student", icon: <ChecklistRtlIcon className="w-4 h-4 text-green-500" />, path: "/configprogram" },
    
    { text: "Manage Submission", icon: <EditNoteIcon className="w-4 h-4 text-indigo-500" />, path: "/configform" },
    {text : "Manage Keyword", icon: <KeyIcon className="w-4 h-4 text-yellow-500  " />, path: "/configkeyword"},
    { text: "Manage Staff", icon: <ManageAccountsIcon className="w-4 h-4 text-cyan-500" />, path: "/configemployee" },
  ];

  const superAdminMenuItems = [
    { text: "SUPER ADMIN", icon: <AdminPanelSettingsIcon className="w-4 h-4 text-black" />, path: "/superadmin" },
  ];

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

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
          {/* Menu Items */}
          <SidebarMenuSection items={menuItems} />

          {/* Divider */}
          {user?.roles.includes("admin") && user.isAdmin?.length > 0 && (
            <hr className="my-4 border-gray-300" />
          )}

          {/* Config Section: Check if roles include "admin" and isAdmin is not empty */}
          {(user?.roles.includes("admin") && user.isAdmin?.length > 0) && (
            <SidebarMenuSection items={configMenuItems} />
          )}

          {/* Divider for SUPER ADMIN */}
          {(user?.roles.includes("platform_admin") && user.isPlatformAdmin) && (
            <>
              <hr className="my-4 border-gray-300" />
              <SidebarMenuSection items={superAdminMenuItems} />
            </>
          )}
        </div>
      </aside>

      {/* Content Area */}
      <main className="flex-grow mt-16 sm:ml-52">{children}</main>
    </div>
  );
}
