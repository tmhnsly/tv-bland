export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-200 dark:bg-gray-900">
      <div className="min-h-screen pb-8">
        <section className="flex flex-col items-center px-5">
          <div className="flex w-full max-w-4xl flex-col items-center justify-center gap-5 pb-5 pt-20 md:flex-row lg:translate-y-16 lg:pt-5">
            <div className="aspect-[2/3] w-full max-w-sm animate-pulse rounded-lg bg-black/10 dark:bg-white/10" />
            <div className="h-72 w-full animate-pulse rounded-lg bg-black/10 dark:bg-white/10 lg:max-w-xl" />
          </div>
        </section>
        <section className="mt-10 bg-white/80 py-10 dark:bg-black/80 lg:py-24">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-10 md:grid-cols-2">
            <div className="h-48 animate-pulse rounded-lg bg-black/10 dark:bg-white/10" />
            <div className="h-48 animate-pulse rounded-lg bg-black/10 dark:bg-white/10" />
          </div>
        </section>
      </div>
    </div>
  );
}
