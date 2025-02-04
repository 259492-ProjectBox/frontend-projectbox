import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // Get token from cookies (this only works in a Server Component)
    const token = cookies().get("cmuToken")?.value;

    if (!token) {
      return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }

    // Extract programId from query params
    const { searchParams } = new URL(request.url);
    const programId = searchParams.get("programId");

    if (!programId) {
      return NextResponse.json({ ok: false, message: "Missing programId" }, { status: 400 });
    }

    // Fetch configuration data from your backend
    const response = await fetch(`https://project-service.kunmhing.me/api/v1/configs/program/${programId}`, {
      method: "GET",
      headers: {
        "accept": "application/json",
        "Authorization": `Bearer ${token}`, // Send the token
      },
    });

    if (!response.ok) {
      return NextResponse.json({ ok: false, message: "Failed to fetch data" }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({ ok: true, data });

  } catch (error) {
    return NextResponse.json({ ok: false, message: "Internal Server Error" }, { status: 500 });
  }
}
