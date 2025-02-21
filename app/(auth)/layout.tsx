import React, { PropsWithChildren } from "react";
import SideBar from "../../components/SideBar";
import { serverGetCookie } from "../../utils/helpFunction";

function AuthLayout({ children }: PropsWithChildren) {
	const token = serverGetCookie();

	if (!token) {
		return <>{children}</>;
	}

	return (
		<>
			<SideBar>{children}</SideBar>
		</>
	);
}

export default AuthLayout;
