export default function Loading() {
  return (
    <main className="mx-auto max-w-6xl px-5 pb-24 pt-28 md:px-10 md:pt-36">
      <div className="flex flex-col gap-8 md:flex-row md:gap-10">
        <div className="mx-auto w-full max-w-[240px] shrink-0 md:mx-0 md:w-60">
          <div className="skeleton aspect-[2/3] rounded-2xl" />
        </div>
        <div className="flex-1 space-y-4">
          <div className="skeleton h-12 w-3/4 rounded-lg" />
          <div className="skeleton h-4 w-1/2 rounded" />
          <div className="skeleton h-6 w-40 rounded" />
          <div className="space-y-2 pt-4">
            <div className="skeleton h-4 w-full rounded" />
            <div className="skeleton h-4 w-full rounded" />
            <div className="skeleton h-4 w-2/3 rounded" />
          </div>
        </div>
      </div>
    </main>
  );
}
