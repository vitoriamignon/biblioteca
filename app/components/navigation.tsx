import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

// Ícone de livro em SVG
const BookIcon = () => (
  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2a1 1 0 01.894.553L14 5.236 16.472 3.39a1 1 0 011.387.387l.085.126L19 6.236l2.472-1.846a1 1 0 011.397.124l.087.126a1 1 0 01-.124 1.398L21 7.764V19a2 2 0 01-1.85 1.995L19 21H5a2 2 0 01-1.995-1.85L3 19V7.764L1.168 6.038a1 1 0 01-.124-1.398l.087-.126a1 1 0 011.397-.124L5 6.236l1.056-2.333a1 1 0 011.387-.387L9.916 5.236 11.106 2.553A1 1 0 0112 2zM5 8.236l-1.528-1.14L5 5.764V8.236zm14 0V5.764l1.528 1.332L19 8.236zM17 9v10H7V9h10zm-2 2H9v2h6v-2zm0 4H9v2h6v-2z"/>
  </svg>
);

// Ícone de biblioteca em SVG
const LibraryIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
  </svg>
);

// Ícone de adicionar em SVG
const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

export function Navigation() {
  return (
    <nav className="border-b bg-background/95 backdrop-blur-sm border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-8">
          <Link
            href="/library"
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-105"
          >
            <LibraryIcon />
            Biblioteca
          </Link>
          <Link
            href="/library/add"
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-105"
          >
            <PlusIcon />
            Adicionar Livro
          </Link>
        </div>

        <Link
          href="/"
          className="flex items-center text-2xl font-bold transition-all duration-200 hover:scale-105"
        >
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-extrabold dark:from-blue-400 dark:to-purple-400">
            BookShelf
          </span>
        </Link>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
