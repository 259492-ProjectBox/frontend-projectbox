import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { JWTPayload } from "../../types/JWTPayload";

type SuccessResponse = {
	ok: true;
	cmuAccount: string;
	firstName: string;
	lastName: string;
	studentId?: string;
	major: string;
};

type ErrorResponse = {
	ok: false;
	message: string;
};

export type WhoAmIResponse = SuccessResponse | ErrorResponse;

export async function GET() {
	// Get the cookie from the request
	const cookieStore = cookies();
	const token = cookieStore.get("cmuToken")?.value;

	// Validate token
	if (typeof token !== "string") {
		return NextResponse.json(
			{ ok: false, message: "Invalid token" },
			{ status: 401 }
		);
	}

	try {
		const decoded = jwt.verify(
			token,
			process.env.JWT_SECRET as string
		) as JWTPayload;

		return NextResponse.json({
			ok: true,
			cmuAccount: decoded.cmuAccount,
			firstName: decoded.firstName,
			lastName: decoded.lastName,
			studentId: decoded.studentId,
			major: decoded.major,
		});
	} catch (error) {
		console.log(error);

		return NextResponse.json(
			{ ok: false, message: "Invalid token" },
			{ status: 401 }
		);
	}
}
