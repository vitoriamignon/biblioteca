import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-foreground mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-muted-foreground mb-2">
            Página não encontrada
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            A página que você está procurando não existe ou pode ter sido removida.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/library"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            📚 Ir para a Biblioteca
          </Link>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/dashboard"
              className="px-4 py-2 border border-border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              Dashboard
            </Link>
            
            <Link
              href="/library/add"
              className="px-4 py-2 border border-border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              Adicionar Livro
            </Link>
          </div>
        </div>

        <div className="mt-12 text-sm text-muted-foreground">
          <p>BookShelf - Sua biblioteca digital</p>
        </div>
      </div>
    </div>
  );
}