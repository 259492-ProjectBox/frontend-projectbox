"use client";
import React from "react";
import SidebarMenuItem from "./SidebarMenuItem";

interface MenuItem {
  text: string;
  icon: React.ReactNode;
  path: string;
}

interface SidebarMenuSectionProps {
  items: MenuItem[];
}

export default function SidebarMenuSection({ items }: SidebarMenuSectionProps) {
  return (
    <ul className="space-y-2 font-medium text-sm">
      {items.map((item) => (
        <li key={item.text}>
          <SidebarMenuItem text={item.text} icon={item.icon} path={item.path} />
        </li>
      ))}
    </ul>
  );
}
