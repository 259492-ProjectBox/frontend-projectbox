"use client";

import { useOAuthCallback } from "@/hooks/useOAuthCallback";

export default function CMUOAuthCallback() {
	const { isLoading, error } = useOAuthCallback();

	if (error) {
		return <div className="p-3 text-red-500">{error}</div>;
	}

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-screen">
				<div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
				<span className="ml-3 text-lg font-medium text-blue-500">Redirecting...</span>
			</div>
		);
	}

	return null;
}
