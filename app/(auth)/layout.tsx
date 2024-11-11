import React, { PropsWithChildren } from "react";
import SideBar from "../components/SideBar";

function AuthLayout({ children }: PropsWithChildren) {
	return (
		<>
			<SideBar>{children}</SideBar>
		</>
	);
}

export default AuthLayout;
