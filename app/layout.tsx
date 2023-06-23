"use client";
import Link from "next/link";
import "./globals.css";
import { PiTelevisionDuotone } from "react-icons/pi";
import { IoMoon, IoSunny } from "react-icons/io5";
import React from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [darkMode, setDarkMode] = React.useState(false);

  return (
    <html className={`${darkMode ? "dark" : ""}`}>
      <body className="bg-white dark:bg-black">
        <main>
          <nav className="sticky top-0 left-0 w-full flex items-center justify-between px-5 h-16 bg-white/20 dark:bg-black/20 text-black dark:text-white backdrop-blur-xl z-50 shadow-md">
            <Link
              className="p-2 flex items-center justify-center rounded-md hover:bg-black/10 dark:hover:bg-white/20 transition"
              href="/"
            >
              <PiTelevisionDuotone />
              <span className="ml-1 font-medium">TV Bland</span>
            </Link>
            <button
              className="p-3 flex items-center justify-center rounded-md hover:bg-black/10 dark:hover:bg-white/20 transition"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? <IoSunny /> : <IoMoon />}
            </button>
          </nav>
          {children}
        </main>
      </body>
    </html>
  );
}
