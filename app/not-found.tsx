import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="font-display text-7xl font-semibold text-accent">404</p>
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="max-w-sm text-muted">
        We couldn&apos;t find what you were looking for.
      </p>
      <Link
        href="/"
        className="mt-3 rounded-lg bg-accent px-5 py-2.5 font-medium text-accent-fg transition hover:opacity-90"
      >
        Back to home
      </Link>
    </main>
  );
}
