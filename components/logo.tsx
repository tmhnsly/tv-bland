"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// The TV screen remounts on every route change (key=pathname), replaying the
// channel-flip glitch — so navigating "changes the channel".
const Logo: React.FC = () => {
  const pathname = usePathname();

  return (
    <Link
      href="/"
      aria-label="TV Bland — home"
      className="group flex shrink-0 items-center gap-2.5 rounded-lg px-2 py-1.5 transition hover:bg-fg/5"
    >
      <span
        key={pathname}
        aria-hidden
        className="tv-screen h-6 w-8 ring-1 ring-black/30"
      />
      <span className="hidden font-display text-lg font-semibold tracking-tight sm:inline">
        Dropoff TV
      </span>
    </Link>
  );
};

export default Logo;
