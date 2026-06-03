import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { PiTelevisionDuotone } from "react-icons/pi";
import { Rubik } from "next/font/google";
import ThemeToggle from "@/components/themeToggle";
import SearchBox from "@/components/searchBox";
import "./globals.css";

const rubik = Rubik({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ??
      (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : "http://localhost:3000")
  ),
  title: {
    default: "TV Bland",
    template: "%s | TV Bland",
  },
  description:
    "TV Show and web series database. Create personalised schedules. Episode guide, cast, crew and character information.",
  openGraph: {
    title: "TV Bland",
    description:
      "TV Show and web series database. Episode guide, cast, crew and character information.",
    type: "website",
  },
};

// Runs before paint so the correct theme is applied on first render (no flash).
const themeScript = `(function(){try{var t=localStorage.getItem("theme");var d=t==="dark"||(!t&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d);}catch(e){}})();`;

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${rubik.className} bg-white text-black dark:bg-black dark:text-white`}
      >
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <main>
          <nav className="fixed top-0 w-full flex items-center justify-between px-5 h-16 bg-white/20 dark:bg-black/20 text-black dark:text-white backdrop-blur-xl z-50 shadow-md">
            <Link
              className="flex shrink-0 items-center justify-center rounded-md p-3 hover:bg-black/10 dark:hover:bg-white/20 transition"
              href="/"
            >
              <PiTelevisionDuotone />
              <span className="ml-1 hidden font-medium sm:inline">TV Bland</span>
            </Link>
            <Link
              href="/browse"
              className="shrink-0 rounded-md px-3 py-2 text-sm font-medium transition hover:bg-black/10 dark:hover:bg-white/20"
            >
              Browse
            </Link>
            <SearchBox />
            <ThemeToggle />
          </nav>
          {children}
        </main>
      </body>
    </html>
  );
}
