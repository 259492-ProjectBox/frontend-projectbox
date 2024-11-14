import React, { PropsWithChildren } from "react";
import { redirect } from "next/navigation";
import { serverGetCookie } from "../../utils/helpFunction";
import Navbar from "@/components/Navbar";

function CreateLayout({ children }: PropsWithChildren) {
	const token = serverGetCookie();

	if (!token) {
		redirect("/");
	}

	return (
		<>
			<Navbar />
			{children}
		</>
	);
}

export default CreateLayout;
