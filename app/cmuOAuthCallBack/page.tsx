"use client";

import { useOAuthCallback } from "@/hooks/useOAuthCallback";

export default function CMUOAuthCallback() {
	const { isLoading, error } = useOAuthCallback();

	if (error) {
		return <div className="p-3 text-red-500">{error}</div>;
	}

	if (isLoading) {
		return <div className="p-3">Redirecting...</div>;
	}

	return null;
}
