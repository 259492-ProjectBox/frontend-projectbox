import axios from "axios";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { CmuOAuthBasicInfo } from "../../types/CmuOAuthBasicInfo";

type SuccessResponse = {
	ok: true;
};

type ErrorResponse = {
	ok: false;
	message: string;
};

export type SignInResponse = SuccessResponse | ErrorResponse;

async function getOAuthAccessTokenAsync(
	authorizationCode: string
): Promise<string | null> {
	try {
		const response = await axios.post(
			process.env.CMU_OAUTH_GET_TOKEN_URL as string,
			{},
			{
				params: {
					code: authorizationCode,
					redirect_uri: process.env.CMU_OAUTH_REDIRECT_URL,
					client_id: process.env.CMU_OAUTH_CLIENT_ID,
					client_secret: process.env.CMU_OAUTH_CLIENT_SECRET,
					grant_type: "authorization_code",
				},
				headers: {
					"content-type": "application/x-www-form-urlencoded",
				},
			}
		);
		return response.data.access_token;
	} catch (err) {
		console.log(err);
		return null;
	}
}

async function getCMUBasicInfoAsync(accessToken: string) {
	try {
		const response = await axios.get(
			process.env.CMU_OAUTH_GET_BASIC_INFO as string,
			{
				headers: { Authorization: "Bearer " + accessToken },
			}
		);
		return response.data as CmuOAuthBasicInfo;
	} catch (err) {
		console.log(err);
		return null;
	}
}

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
	const accessToken = await getOAuthAccessTokenAsync(authorizationCode);
	if (!accessToken) {
		return NextResponse.json(
			{ ok: false, message: "Cannot get OAuth access token" },
			{ status: 400 }
		);
	}

	// Get CMU basic info
	const cmuBasicInfo = await getCMUBasicInfoAsync(accessToken);
	if (!cmuBasicInfo) {
		return NextResponse.json(
			{ ok: false, message: "Cannot get CMU basic info" },
			{ status: 400 }
		);
	}

	if (typeof process.env.JWT_SECRET !== "string") {
		throw new Error("Please assign JWT_SECRET in .env!");
	}

	const token = jwt.sign(
		{
			cmuAccount: cmuBasicInfo.cmuitaccount,
			firstName: cmuBasicInfo.firstname_EN,
			lastName: cmuBasicInfo.lastname_EN,
			studentId: cmuBasicInfo.student_id,
		},
		process.env.JWT_SECRET,
		{ expiresIn: "1h" }
	);

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
