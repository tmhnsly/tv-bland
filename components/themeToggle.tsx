"use client";

import React from "react";
import { IoMoon, IoSunny } from "react-icons/io5";

// The theme only ever changes through this toggle, so the "store" is just the
// `dark` class on <html> (set before paint by the inline script in the layout).
// useSyncExternalStore lets us read it without a setState-in-effect and without
// a hydration mismatch.
const listeners = new Set<() => void>();

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  return () => listeners.delete(onChange);
}

function getSnapshot() {
  return document.documentElement.classList.contains("dark");
}

function getServerSnapshot() {
  return false;
}

/**
 * Toggles the `dark` class on <html> and persists the choice to localStorage.
 */
const ThemeToggle: React.FC = () => {
  const isDark = React.useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const toggle = () => {
    const next = !isDark;
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
    listeners.forEach((onChange) => onChange());
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="p-3 flex items-center justify-center rounded-md hover:bg-black/10 dark:hover:bg-white/20 transition"
    >
      {isDark ? <IoSunny /> : <IoMoon />}
    </button>
  );
};

export default ThemeToggle;
