import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { PiTelevisionDuotone } from "react-icons/pi";
import { Bricolage_Grotesque, Hanken_Grotesk } from "next/font/google";
import ThemeToggle from "@/components/themeToggle";
import SearchBox from "@/components/searchBox";
import "./globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const sans = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ??
      (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : "http://localhost:3000")
  ),
  title: {
    default: "TV Bland",
    template: "%s · TV Bland",
  },
  description:
    "A cinematic TV companion — what's on now, full episode guides, cast and crew.",
  openGraph: {
    title: "TV Bland",
    description:
      "A cinematic TV companion — what's on now, full episode guides, cast and crew.",
    type: "website",
  },
};

// Dark-first: apply dark unless the visitor has explicitly chosen light.
const themeScript = `(function(){try{var t=localStorage.getItem("theme");document.documentElement.classList.toggle("dark",t!=="light");}catch(e){document.documentElement.classList.add("dark");}})();`;

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${display.variable} ${sans.variable}`}
    >
      <body className="app-grain min-h-screen font-sans antialiased">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <div className="app-backdrop" aria-hidden />

        <nav className="fixed inset-x-0 top-0 z-50 flex h-16 items-center gap-2 border-b hairline bg-bg/70 px-4 backdrop-blur-xl md:px-6">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2 rounded-lg px-2 py-1.5 transition hover:bg-fg/5"
          >
            <PiTelevisionDuotone className="text-accent" size={24} />
            <span className="hidden font-display text-lg font-semibold tracking-tight sm:inline">
              TV Bland
            </span>
          </Link>
          <Link
            href="/browse"
            className="shrink-0 rounded-lg px-3 py-2 text-sm font-medium text-muted transition hover:bg-fg/5 hover:text-fg"
          >
            Browse
          </Link>
          <SearchBox />
          <ThemeToggle />
        </nav>

        {children}
      </body>
    </html>
  );
}
