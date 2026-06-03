import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Bricolage_Grotesque, Hanken_Grotesk } from "next/font/google";
import ThemeToggle from "@/components/themeToggle";
import SearchBox from "@/components/searchBox";
import Logo from "@/components/logo";
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
    default: "Dropoff TV — is it worth your time?",
    template: "%s · Dropoff TV",
  },
  description:
    "Worth It scores, episode-rating heatmaps and when-to-stop advice for any TV show.",
  openGraph: {
    title: "Dropoff TV — is it worth your time?",
    description:
      "Worth It scores, episode-rating heatmaps and when-to-stop advice for any TV show.",
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

        <nav className="fixed inset-x-0 top-0 z-50 flex h-16 items-center gap-1 border-b hairline bg-bg/70 px-3 backdrop-blur-xl sm:gap-2 sm:px-5">
          <Logo />
          <Link
            href="/browse"
            className="shrink-0 rounded-lg px-2.5 py-2 text-sm font-medium text-muted transition hover:bg-fg/5 hover:text-fg"
          >
            Browse
          </Link>
          <SearchBox className="min-w-0 flex-1" />
          <ThemeToggle />
        </nav>

        {children}
      </body>
    </html>
  );
}
