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
			<div style={{ marginTop: "4rem", padding: "1rem" }}>{children}</div>
			{/* <div
				style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
			>
				<header style={{ flexShrink: 0 }}>
					<Navbar />
				</header>

				<main style={{ flexGrow: 1, padding: "1rem" }}>{children}</main>
			</div> */}
		</>
	);
}

export default CreateLayout;
