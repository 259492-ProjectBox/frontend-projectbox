export async function GET(req: Request) {
	// Get `courseId` and `version` from query params
	const { searchParams } = new URL(req.url);
	const courseId = searchParams.get("courseId");
	const version = searchParams.get("version");

	if (!courseId) {
		return new Response(JSON.stringify({ error: "courseId is required" }), {
			status: 400,
		});
	}

	// Build the Elysia API URL
	let elysiaUrl = `http://localhost:4000/form-config/latest/${courseId}`;
	if (version) {
		elysiaUrl = `http://localhost:4000/form-config/${version}/${courseId}`;
	}

	try {
		// Fetch data from Elysia
		const response = await fetch(elysiaUrl);
		const data = await response.json();

		// Return the response to the Next.js client
		return new Response(JSON.stringify(data), { status: response.status });
	} catch (error) {
		console.error("Error fetching from Elysia:", error);
		return new Response(
			JSON.stringify({ error: "Failed to fetch data from Elysia" }),
			{ status: 500 }
		);
	}
}
export async function POST(req: Request) {
	try {
		const body = await req.json();

		// Forward the request to the Elysia server
		const response = await fetch("http://localhost:4000/form-config", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		});

		// Return the response to the Next.js client
		const responseData = await response.json();
		return new Response(JSON.stringify(responseData), {
			status: response.status,
		});
	} catch (error) {
		console.error("Error sending data to Elysia:", error);
		return new Response(
			JSON.stringify({ error: "Failed to send data to Elysia" }),
			{ status: 500 }
		);
	}
}
