export default function Loading() {
  return (
    <div className="text-black dark:text-white">
      <header className="bg-gray-200/80 backdrop-blur-2xl dark:bg-gray-900/80">
        <div className="mx-auto max-w-7xl px-6 pb-20 pt-32 md:px-10">
          <div className="h-14 w-64 animate-pulse rounded-lg bg-black/10 dark:bg-white/10" />
          <div className="mt-5 h-6 w-full max-w-2xl animate-pulse rounded bg-black/10 dark:bg-white/10" />
        </div>
      </header>

      <section className="bg-white/90 backdrop-blur-2xl dark:bg-black/90">
        <div className="mx-auto max-w-7xl px-6 py-12 md:px-10">
          <div className="mb-8 h-8 w-40 animate-pulse rounded bg-black/10 dark:bg-white/10" />
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-3 p-2">
                <div className="aspect-[3/4] animate-pulse rounded-lg bg-black/10 dark:bg-white/10" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-black/10 dark:bg-white/10" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
