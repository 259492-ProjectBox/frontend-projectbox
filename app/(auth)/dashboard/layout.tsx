// import { redirect } from "next/navigation";
import { serverGetCookie } from "@/utils/helpFunction";
import { redirect } from "next/navigation";
import React, { PropsWithChildren } from "react";

function AuthLayout({ children }: PropsWithChildren) {
	  const token = serverGetCookie();
	
	  if (!token) {
		redirect("/");
	  }

	return <>{children}</>;
}

export default AuthLayout;
