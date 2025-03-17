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

	if (typeof authorizationCode !== "string") {
		return NextResponse.json(
			{ ok: false, message: "Invalid authorization code" },
			{ status: 400 }
		);
	}

	
	// Get access token
	// const accessToken = await getOAuthAccessTokenAsync(authorizationCode);
	// if (!accessToken) {
	// 	return NextResponse.json(
	// 		{ ok: false, message: "Cannot get OAuth access token" },
	// 		{ status: 400 }
	// 	);
	// }

	// // Get CMU basic info
	// const cmuBasicInfo = await getCMUBasicInfoAsync(accessToken);
	// if (!cmuBasicInfo) {
	// 	return NextResponse.json(
	// 		{ ok: false, message: "Cannot get CMU basic info" },
	// 		{ status: 400 }
	// 	);
	// }

	if (typeof process.env.JWT_SECRET !== "string") {
		throw new Error("Please assign JWT_SECRET in .env!");
	}

	// const payload: JWTPayload = {
    //     cmuAccount: cmuBasicInfo.cmuitaccount,
    //     firstName: cmuBasicInfo.firstname_EN,
    //     lastName: cmuBasicInfo.lastname_EN,
    //     studentId: cmuBasicInfo.student_id,
    //     orgName: cmuBasicInfo.organization_name_EN,
    //     isAdmin: cmuBasicInfo.cmuitaccount === "admin" // or your admin check logic
    // };

    // const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

	// make it send to AuthService that is in localhost 3002 
	// and get the response from there
	if (typeof process.env.AUTH_SERVICE_URL !== "string") {
		throw new Error("Please assign AUTHSERVICE_URL in .env!");
	}
	const tokenResponse = await axiosInstance.post(process.env.AUTH_SERVICE_URL + "/api/signin", {
		authorizationCode: authorizationCode
	});
	
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
