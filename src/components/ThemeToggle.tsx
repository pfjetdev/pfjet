"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center h-9 w-9 rounded-md border border-border bg-background hover:bg-accent hover:text-accent-foreground transition-all duration-200"
      title="Toggle theme"
      aria-label="Toggle theme"
    >
      {/* Sun icon - visible in dark mode */}
      <Sun className="h-4 w-4 hidden dark:block" />
      {/* Moon icon - visible in light mode */}
      <Moon className="h-4 w-4 block dark:hidden" />
    </button>
  );
}