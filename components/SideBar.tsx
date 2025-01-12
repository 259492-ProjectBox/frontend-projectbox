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
import LogoutIcon from "@mui/icons-material/Logout";
import InventoryIcon from "@mui/icons-material/Inventory";
import EventIcon from "@mui/icons-material/Event";
import SettingsIcon from "@mui/icons-material/Settings";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import ChecklistRtlIcon from "@mui/icons-material/ChecklistRtl";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import EditNoteIcon from "@mui/icons-material/EditNote";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

export default function Sidebar({ children }: React.PropsWithChildren) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { signOut } = useAuth();

  const menuItems = [
    { text: "My Project", icon: <PersonIcon className="w-4 h-4 text-blue-500" />, path: "/dashboard" },
    { text: "Search Project", icon: <SearchIcon className="w-4 h-4 text-teal-500" />, path: "/search" },
    { text: "Advisor Stats", icon: <GroupsIcon className="w-4 h-4 text-purple-500" />, path: "/advisorstats" },
    { text: "Event Calendar", icon: <EventIcon className="w-4 h-4 text-red-500" />, path: "/eventcalendar" },
    { text: "Assets", icon: <InventoryIcon className="w-4 h-4 text-orange-500" />, path: "/assetspage" },
  ];

  const configMenuItems = [
    { text: "Config Calendar", icon: <EditCalendarIcon className="w-4 h-4 text-yellow-500" />, path: "/configcalendar" },
    { text: "Config Form", icon: <EditNoteIcon className="w-4 h-4 text-indigo-500" />, path: "/configform" },
    { text: "Config Advisor", icon: <ManageAccountsIcon className="w-4 h-4 text-pink-500" />, path: "/configadvisor" },
    { text: "Config Assets", icon: <SettingsIcon className="w-4 h-4 text-cyan-500" />, path: "/configassets" },
    { text: "Admin Manage", icon: <SupervisorAccountIcon className="w-4 h-4 text-rose-500" />, path: "/adminmanage" },
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
          <hr className="my-4 border-gray-300" />

          {/* Config Section */}
          <SidebarMenuSection items={configMenuItems} />

          {/* Divider */}
          <hr className="my-4 border-gray-300" />

          {/* SUPER ADMIN Section */}
          <SidebarMenuSection items={superAdminMenuItems} />

          {/* Logout Section */}
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
