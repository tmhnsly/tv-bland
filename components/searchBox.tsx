"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { IoSearch } from "react-icons/io5";

type Suggestion = {
  id: number;
  name: string;
  year: string | null;
  image: string | null;
};

const SearchBox: React.FC = () => {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [suggestions, setSuggestions] = React.useState<Suggestion[]>([]);
  const [open, setOpen] = React.useState(false);

  // Debounced lookup for the dropdown. All setState happens inside the async
  // timeout callback (never synchronously in the effect body).
  React.useEffect(() => {
    const q = query.trim();
    const timer = setTimeout(async () => {
      if (!q) {
        setSuggestions([]);
        return;
      }
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        if (res.ok) setSuggestions(await res.json());
      } catch {
        setSuggestions([]);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const q = query.trim();
    if (!q) return;
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <form
      onSubmit={submit}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
      }}
      role="search"
      className="relative mx-3 w-full max-w-md"
    >
      <div className="flex items-center gap-2 rounded-md bg-black/5 px-3 dark:bg-white/10">
        <IoSearch className="shrink-0 opacity-60" aria-hidden />
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search shows…"
          aria-label="Search shows"
          className="w-full bg-transparent py-2 text-sm outline-none placeholder:text-black/50 dark:placeholder:text-white/50"
        />
      </div>

      {open && suggestions.length > 0 && (
        <ul className="absolute left-0 right-0 top-full mt-2 overflow-hidden rounded-md border border-black/10 bg-white shadow-xl dark:border-white/10 dark:bg-neutral-900">
          {suggestions.map((s) => (
            <li key={s.id}>
              <Link
                href={`/show/${s.id}`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2 hover:bg-black/5 dark:hover:bg-white/10"
              >
                <span className="relative h-12 w-9 shrink-0 overflow-hidden rounded bg-black/10 dark:bg-white/10">
                  {s.image && (
                    <Image
                      src={s.image}
                      alt=""
                      fill
                      sizes="36px"
                      className="object-cover"
                    />
                  )}
                </span>
                <span className="truncate text-sm">
                  {s.name}
                  {s.year && (
                    <span className="ml-1 text-black/50 dark:text-white/50">
                      ({s.year})
                    </span>
                  )}
                </span>
              </Link>
            </li>
          ))}
          <li>
            <Link
              href={`/search?q=${encodeURIComponent(query.trim())}`}
              onClick={() => setOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-blue-600 hover:bg-black/5 dark:text-blue-400 dark:hover:bg-white/10"
            >
              See all results for “{query.trim()}”
            </Link>
          </li>
        </ul>
      )}
    </form>
  );
};

export default SearchBox;
