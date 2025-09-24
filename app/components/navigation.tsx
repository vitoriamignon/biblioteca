import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

export function Navigation() {
  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-6">
          
          <Link
            href="/library"
            className="text-xl font-medium text-muted-foreground hover:text-foreground transition-colors"
             style={{ marginLeft: '-15px' }}
          >
            Biblioteca
          </Link>
          <Link
            href="/library/add"
            className="text-xl font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Adicionar Livro
          </Link>
        </div>

        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 flex items-center text-5xl font-bold"
        >
          <span>📚</span>
          <span className="bg-gradient-to-r from-pink-500 via-yellow-400 via-purple-500 via-orange-400 via-green-400 to-cyan-400 bg-clip-text text-transparent ml-2 outline-text">
            BookShelf
          </span>
          <span className="ml-2">📚</span>
        </Link>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
