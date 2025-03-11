import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
	// Access cookies in the App Router
	const cookieStore = cookies();
	cookieStore.delete("cmuToken");

	const SignOut = process.env.CMU_ENTRAID_LOGOUT_URL;
	// Return a JSON response indicating success
	return NextResponse.json({ ok: true , signOut: SignOut });
}
