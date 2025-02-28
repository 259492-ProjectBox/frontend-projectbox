"use client";

import Spinner from "@/components/Spinner";
import { Suspense } from "react";
import CMUOAuthCallback from "./page";

export default function CMUCallbackPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <CMUOAuthCallback />
    </Suspense>
  );
}
