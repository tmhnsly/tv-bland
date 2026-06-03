"use client";

import Link from "next/link";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center text-black dark:text-white">
      <h1>Something went wrong</h1>
      <p className="text-gray-500 dark:text-gray-400">
        An unexpected error occurred. Please try again.
      </p>
      <div className="mt-2 flex gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-md bg-black/10 px-4 py-2 transition hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-md px-4 py-2 transition hover:bg-black/5 dark:hover:bg-white/5"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
