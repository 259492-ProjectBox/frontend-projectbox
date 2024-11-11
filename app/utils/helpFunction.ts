import { cookies } from "next/headers";

export function serverGetCookie() {
	const cookieStore = cookies();
	const token = cookieStore.get("cmuToken")?.value;
	return token;
}
