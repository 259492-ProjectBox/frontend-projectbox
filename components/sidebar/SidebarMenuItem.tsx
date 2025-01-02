"use client";
import React from "react";
import { useRouter, usePathname } from "next/navigation";

interface SidebarMenuItemProps {
  text: string;
  icon: React.ReactNode;
  path: string;
}

export default function SidebarMenuItem({ text, icon, path }: SidebarMenuItemProps) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <button
      onClick={() => router.push(path)}
      className={`flex items-center w-full p-2 rounded-lg hover:bg-gray-100 ${
        pathname === path ? "bg-gray-200" : ""
      }`}
    >
      <div className="text-gray-500 group-hover:text-gray-900">{icon}</div>
      <span className="ml-3">{text}</span>
    </button>
  );
}
