import React, { PropsWithChildren } from "react";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import { serverGetCookie } from "@/utils/helpFunction";

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
