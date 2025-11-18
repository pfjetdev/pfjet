"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Предотвращаем ошибки гидратации
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-9 w-9 rounded-md border border-border bg-muted animate-pulse" />
    );
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center h-9 w-9 rounded-md border border-border bg-background hover:bg-accent hover:text-accent-foreground transition-all duration-200"
      title={isDark ? "Переключить на светлую тему" : "Переключить на темную тему"}
      aria-label={isDark ? "Переключить на светлую тему" : "Переключить на темную тему"}
    >
      {isDark ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </button>
  );
}