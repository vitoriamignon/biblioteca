"use client";

import * as React from "react";
import { useTheme } from "./theme-provider";

interface ThemeToggleProps {
  className?: string;
}

// Ícone do Sol
const SunIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

// Ícone da Lua
const MoonIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);

// Ícone do Monitor
const MonitorIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Fechar dropdown com tecla ESC
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  if (!mounted) {
    return null;
  }

  const getIcon = () => {
    if (theme === "system") return <MonitorIcon />;
    if (resolvedTheme === "dark") return <MoonIcon />;
    return <SunIcon />;
  };

  const getLabel = () => {
    if (theme === "system") return "Sistema";
    if (resolvedTheme === "dark") return "Escuro";
    return "Claro";
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          inline-flex items-center justify-center rounded-lg p-3 
          bg-background border-2 border-border shadow-md
          transition-all duration-200 focus-visible:outline-none 
          focus-visible:ring-2 focus-visible:ring-ring 
          focus-visible:ring-offset-2 disabled:pointer-events-none 
          disabled:opacity-50 hover:bg-accent hover:text-accent-foreground
          hover:shadow-lg hover:scale-105 hover:border-primary/30
          ${className}
        `}
        aria-label="Alternar tema"
        title={getLabel()}
      >
        {getIcon()}
        <span className="sr-only">{getLabel()}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 dark:bg-black/70"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 z-50 mt-2 w-44 rounded-lg border-2 border-border bg-background shadow-xl ring-1 ring-black/10 dark:ring-white/10">
            <div className="p-2">
              <button
                onClick={() => {
                  setTheme("light");
                  setIsOpen(false);
                }}
                className={`
                  flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium
                  transition-all duration-200 hover:bg-accent hover:text-accent-foreground
                  ${theme === "light" ? "bg-primary text-primary-foreground shadow-sm" : ""}
                `}
              >
                <SunIcon />
                <span>Modo Claro</span>
              </button>
              <button
                onClick={() => {
                  setTheme("dark");
                  setIsOpen(false);
                }}
                className={`
                  flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium
                  transition-all duration-200 hover:bg-accent hover:text-accent-foreground
                  ${theme === "dark" ? "bg-primary text-primary-foreground shadow-sm" : ""}
                `}
              >
                <MoonIcon />
                <span>Modo Escuro</span>
              </button>
              <button
                onClick={() => {
                  setTheme("system");
                  setIsOpen(false);
                }}
                className={`
                  flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium
                  transition-all duration-200 hover:bg-accent hover:text-accent-foreground
                  ${theme === "system" ? "bg-primary text-primary-foreground shadow-sm" : ""}
                `}
              >
                <MonitorIcon />
                <span>Sistema</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
