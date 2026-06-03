import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center text-black dark:text-white">
      <p className="text-6xl font-semibold">404</p>
      <h1>Page not found</h1>
      <p className="text-gray-500 dark:text-gray-400">
        We couldn&apos;t find what you were looking for.
      </p>
      <Link
        href="/"
        className="mt-2 rounded-md bg-black/10 px-4 py-2 transition hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20"
      >
        Back to home
      </Link>
    </div>
  );
}
