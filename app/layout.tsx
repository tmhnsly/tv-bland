"use client";
import Link from "next/link";
import { PiTelevisionDuotone } from "react-icons/pi";
import { IoMoon, IoSunny } from "react-icons/io5";
import React from "react";
import "./globals.css";

export default function RootLayout({ children }: React.PropsWithChildren<{}>) {
  const [darkMode, toggleDarkMode] = React.useState(false);

  React.useEffect(() => {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      toggleDarkMode(true);
    } else {
      toggleDarkMode(false);
    }
  }, []);

  return (
    <html className={`${darkMode ? "dark" : ""}`}>
      <body className="bg-white dark:bg-black">
        <main>
          <nav className="fixed top-0 w-full flex items-center justify-between px-5 h-16 bg-white/20 dark:bg-black/20 text-black dark:text-white backdrop-blur-xl z-50 shadow-md">
            <Link
              className="flex items-center justify-center rounded-md p-3 hover:bg-black/10 dark:hover:bg-white/20 transition"
              href="/"
            >
              <PiTelevisionDuotone />
              <span className="ml-1 font-medium">TV Bland</span>
            </Link>
            <button
              className="p-3 flex items-center justify-center rounded-md hover:bg-black/10 dark:hover:bg-white/20 transition"
              onClick={() => toggleDarkMode(!darkMode)}
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
