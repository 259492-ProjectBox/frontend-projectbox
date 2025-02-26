"use client";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { WhoAmIResponse } from "../../../dtos/WhoAmIResponse";

export default function MePage() {
	const [fullName, setFullName] = useState("");
	const [cmuAccount, setCmuAccount] = useState("");
	const [studentId, setStudentId] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

	// const [major, setMajor] = useState("");
	useEffect(() => {
		//All cookies that belong to the current url will be sent with the request automatically
		//so we don't have to attach token to the request
		//You can view token (stored in cookies storage) in browser devtools (F12). Open tab "Application" -> "Cookies"
		axios
			.get<unknown, AxiosResponse<WhoAmIResponse>, unknown>("/api/whoAmI")
			.then((response) => {
				if (response.data.ok) {
					setFullName(response.data.firstName + " " + response.data.lastName);
					setCmuAccount(response.data.cmuAccount);
					setStudentId(response.data.studentId ?? "No Student Id");
				}
			})
			.catch((error: AxiosError<WhoAmIResponse>) => {
				if (!error.response) {
					setErrorMessage(
						"Cannot connect to the network. Please try again later."
					);
				} else if (error.response.status === 401) {
					setErrorMessage("Authentication failed");
				} else if (error.response.data.ok === false) {
					setErrorMessage(error.response.data.message);
				} else {
					setErrorMessage("Unknown error occurred. Please try again later");
				}
			});
	}, [cmuAccount]);

	return (
		<div className="p-3">
			<h1>Hi, {fullName}</h1>
			<p>{cmuAccount}</p>
			<p>{studentId}</p>
			{/* <p>{major}</p> */}
			<p className="text-danger">{errorMessage}</p>

			<p className="text-muted fs-6">
				This is a protected route. You can try to view this page without token.
				It will fail.
			</p>
		</div>
	);
}
