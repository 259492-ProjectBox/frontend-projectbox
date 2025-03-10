"use client";

import Spinner from "@/components/Spinner";
import { useOAuthCallback } from "@/hooks/useOAuthCallback";

export default function CMUOAuthCallback() {
  const { isLoading, error } = useOAuthCallback();

  if (error) {
    return <div className="p-3 text-red-500">{error}</div>;
  }

  if (isLoading) {
    return <Spinner />;
  }

  return null;
}
