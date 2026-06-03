"use client";

import React from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

const ShowcaseRow: React.FC<React.PropsWithChildren> = ({ children }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = React.useState(true);
  const [atEnd, setAtEnd] = React.useState(true);

  const update = React.useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  }, []);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Measure after paint (async — never a synchronous setState in the effect).
    const raf = requestAnimationFrame(update);
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const scrollByPage = (dir: number) => {
    const el = ref.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  const arrow =
    "absolute top-[38%] z-10 hidden h-9 w-9 -translate-y-1/2 place-items-center rounded-full glass shadow-lg transition hover:bg-fg/10 md:grid";

  return (
    <div className="relative">
      <div
        ref={ref}
        className="flex snap-x gap-4 overflow-x-auto pb-3 [scrollbar-width:thin]"
      >
        {children}
      </div>

      {!atStart && (
        <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-bg to-transparent" />
      )}
      {!atEnd && (
        <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-bg to-transparent" />
      )}

      {!atStart && (
        <button
          type="button"
          onClick={() => scrollByPage(-1)}
          aria-label="Scroll left"
          className={`${arrow} left-1`}
        >
          <IoChevronBack />
        </button>
      )}
      {!atEnd && (
        <button
          type="button"
          onClick={() => scrollByPage(1)}
          aria-label="Scroll right"
          className={`${arrow} right-1`}
        >
          <IoChevronForward />
        </button>
      )}
    </div>
  );
};

export default ShowcaseRow;
