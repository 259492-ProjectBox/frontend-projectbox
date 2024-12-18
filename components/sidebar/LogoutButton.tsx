"use client";
import React from "react";
import LogoutIcon from "@mui/icons-material/Logout";

interface LogoutButtonProps {
  onLogout: () => void;
}

export default function LogoutButton({ onLogout }: LogoutButtonProps) {
  return (
    <button
      onClick={onLogout}
      className="flex items-center w-full p-2 rounded-lg hover:bg-gray-100"
    >
      <div className="text-red-500 group-hover:text-red-700">
        <LogoutIcon className="w-4 h-4" />
      </div>
      <span className="ml-3 text-sm text-red-500 group-hover:text-red-700">
        Logout
      </span>
    </button>
  );
}
