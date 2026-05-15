"use client";

import { useEffect, useState } from "react";

type Theme = "dark" | "light";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("spin-yuk-theme") as Theme | null;
    const systemPreferred = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const defaultTheme: Theme = storedTheme || systemPreferred;
    document.documentElement.dataset.theme = defaultTheme;
    setMounted(true);
  }, []);

  return <>{mounted ? children : children}</>;
}
