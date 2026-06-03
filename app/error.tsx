"use client";

import Link from "next/link";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="font-display text-3xl font-semibold">
        Something went wrong
      </h1>
      <p className="max-w-sm text-muted">
        An unexpected error occurred. Please try again.
      </p>
      <div className="mt-3 flex gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-lg bg-accent px-5 py-2.5 font-medium text-accent-fg transition hover:opacity-90"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-lg glass px-5 py-2.5 font-medium transition hover:bg-fg/5"
        >
          Home
        </Link>
      </div>
    </main>
  );
}
