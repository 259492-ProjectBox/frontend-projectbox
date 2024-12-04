// import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
// import { CmuOAuthBasicInfo } from "../../../types/CmuOAuthBasicInfo";
import axiosInstance from "@/utils/axiosInstance";

type SuccessResponse = {
	ok: true;
};

type ErrorResponse = {
	ok: false;
	message: string;
};

export type SignInResponse = SuccessResponse | ErrorResponse;

export async function POST(req: Request) {
	const body = await req.json();
	const authorizationCode = body.authorizationCode;

	const tokenResponse = await axiosInstance.post(
		"http://localhost:5000/api/signin",
		{
			authorizationCode: authorizationCode,
		}
	);

	if (tokenResponse.data.ok === false) {
		throw new Error("Cannot get token");
	}
	const token = tokenResponse.data.accessToken;
	// Create response with cookie
	const response = NextResponse.json({ ok: true });

	// Set the cookie with appropriate options
	response.cookies.set("cmuToken", token, {
		maxAge: 3600,
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		path: "/",
		sameSite: "lax", // Added sameSite option
		domain:
			process.env.NODE_ENV === "production"
				? process.env.COOKIE_DOMAIN // Use your domain in production
				: "localhost",
	});

	return response; // Return the response with the cookie
}
