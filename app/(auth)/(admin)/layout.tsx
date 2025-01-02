import React, { PropsWithChildren } from "react";
import { redirect } from "next/navigation";
import SideBar from "@/components/SideBar";
import { serverGetCookie } from "@/utils/helpFunction";

function isAdmin(token: string): boolean {
  // Example logic to determine if the user is an admin.
  // You can replace this with your actual logic, e.g., decoding the token or verifying user permissions.
  try {
    const user = JSON.parse(atob(token.split('.')[1])); // Decodes the JWT payload (this is just an example)
    return user?.role === "admin";
  } catch {
    return false;
  }
}

function AuthLayout({ children }: PropsWithChildren) {
  const token = serverGetCookie();

  if (!token) {
//   if (!token || !isAdmin(token)) {
    redirect("/"); // Redirect to home page if not authenticated or not admin
  }

  return (
    <>
      {children}
    </>
  );
}

export default AuthLayout;
