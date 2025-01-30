"use client";
import * as React from "react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import FlowbiteNavbar from "./FlowbiteNavbar";
import SidebarMenuSection from "./sidebar/SidebarMenuSection";
import LogoutButton from "./sidebar/LogoutButton";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import GroupsIcon from "@mui/icons-material/Groups";
import ChecklistRtlIcon from "@mui/icons-material/ChecklistRtl";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import EditNoteIcon from "@mui/icons-material/EditNote";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

export default function Sidebar({ children }: React.PropsWithChildren) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { signOut, user } = useAuth();

  const menuItems = [
    { text: "My Project", icon: <PersonIcon className="w-4 h-4 text-blue-500" />, path: "/dashboard" },
    { text: "Search Project", icon: <SearchIcon className="w-4 h-4 text-teal-500" />, path: "/search" },
    { text: "Advisor Stats", icon: <GroupsIcon className="w-4 h-4 text-red-500" />, path: "/advisorstats" },
    // { text: "Event Calendar", icon: <EventIcon className="w-4 h-4 text-red-500" />, path: "/eventcalendar" },
    // { text: "Assets", icon: <InventoryIcon className="w-4 h-4 text-orange-500" />, path: "/assetspage" },
  ];

  const configMenuItems = [
    { text: "Manage Program", icon: <ChecklistRtlIcon className="w-4 h-4 text-green-500" />, path: "/configprogram" },
    // { text: "Config Calendar", icon: <EditCalendarIcon className="w-4 h-4 text-yellow-500" />, path: "/configcalendar" },
    { text: "Manage Form", icon: <EditNoteIcon className="w-4 h-4 text-indigo-500" />, path: "/configform" },
    { text: "Manage Staff", icon: <ManageAccountsIcon className="w-4 h-4 text-cyan-500" />, path: "/configemployee" },
    // { text: "Config Assets", icon: <SettingsIcon className="w-4 h-4 text-cyan-500" />, path: "/configassets" },
    // { text: "Admin Manage", icon: <SupervisorAccountIcon className="w-4 h-4 text-rose-500" />, path: "/adminmanage" },
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
          {user?.isPlatformAdmin && (
            <>
              <hr className="my-4 border-gray-300" />
              <SidebarMenuSection items={superAdminMenuItems} />
            </>
          )}

          {/* Logout Section */}
          <hr className="my-4 border-gray-300" />
          <div className="mt-4">
            <LogoutButton onLogout={signOut} />
          </div>
        </div>
      </aside>

      {/* Content Area */}
      <main className="flex-grow mt-16 sm:ml-52">{children}</main>
    </div>
  );
}
