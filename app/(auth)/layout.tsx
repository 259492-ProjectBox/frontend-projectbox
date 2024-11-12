import React, { PropsWithChildren } from "react";
import SideBar from "../../components/SideBar";
import { redirect } from "next/navigation";
import { serverGetCookie } from "../../utils/helpFunction";

function AuthLayout({ children }: PropsWithChildren) {
	const token = serverGetCookie();

	if (!token) {
		redirect("/");
	}

	return (
		<>
			<SideBar>{children}</SideBar>
		</>
	);
}

export default AuthLayout;
