'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-red-300 mb-4">Oops!</h1>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Something went wrong
        </h2>
        <p className="text-gray-600 mb-8">
          We encountered an unexpected error. Please try again.
        </p>
        <div className="flex gap-3 justify-center">
          <Button
            onClick={reset}
            className="btn-primary"
          >
            Try Again
          </Button>
          <Link href="/dashboard">
            <Button variant="outline" className="btn-secondary">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}