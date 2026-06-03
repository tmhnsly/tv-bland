export default function Loading() {
  return (
    <main>
      <section className="mx-auto max-w-8xl px-5 pb-16 pt-32 md:px-10 md:pt-44">
        <div className="skeleton h-3 w-28 rounded-full" />
        <div className="skeleton mt-5 h-12 w-2/3 max-w-xl rounded-lg" />
        <div className="skeleton mt-5 h-5 w-full max-w-md rounded" />
      </section>
      <section className="mx-auto max-w-8xl px-5 pb-24 md:px-10">
        <div className="skeleton mb-7 h-7 w-40 rounded" />
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-3">
              <div className="skeleton aspect-[2/3] rounded-xl" />
              <div className="skeleton h-4 w-3/4 rounded" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
