"use client";

import { useEffect, useState } from "react";
import { Moon, SunMedium } from "lucide-react";

type Theme = "dark" | "light";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("spin-yuk-theme") as Theme | null;
    const systemPreferred = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const activeTheme = storedTheme || systemPreferred;
    setTheme(activeTheme);
    document.documentElement.dataset.theme = activeTheme;
  }, []);

  const toggleTheme = () => {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    window.localStorage.setItem("spin-yuk-theme", nextTheme);
    document.documentElement.dataset.theme = nextTheme;
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
    >
      {theme === "dark" ? <SunMedium size={16} /> : <Moon size={16} />}
      {theme === "dark" ? "Light mode" : "Dark mode"}
    </button>
  );
}
