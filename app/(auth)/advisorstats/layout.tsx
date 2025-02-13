// import { redirect } from "next/navigation";
import { serverGetCookie } from "@/utils/helpFunction";
import { redirect } from "next/navigation";
import React, { PropsWithChildren } from "react";

function AuthLayout({ children }: PropsWithChildren) {
	  const token = serverGetCookie();
	
	  if (!token) {
	//   if (!token || !isAdmin(token)) {
		redirect("/"); // Redirect to home page if not authenticated or not admin
	  }
	// redirect("/");

	return <>{children}</>;
}

export default AuthLayout;
