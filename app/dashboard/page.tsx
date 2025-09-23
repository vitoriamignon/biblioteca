import { getStats } from "@/lib/actions";
import Link from "next/link";
import { Navigation } from "@/components/navigation";

export default async function DashboardPage() {
  // Buscar dados no servidor
  const stats = await getStats();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
          <div className="flex gap-2">
            <Link 
              href="/library" 
              className="px-3 py-2 border border-border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              Ver biblioteca
            </Link>
            <Link 
              href="/library/add" 
              className="px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Adicionar livro
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-card border border-border rounded-lg shadow-sm"> 
            <div className="text-sm text-muted-foreground">Total de livros</div>
            <div className="text-2xl font-bold text-card-foreground">{stats.total}</div>
          </div>
          <div className="p-4 bg-card border border-border rounded-lg shadow-sm"> 
            <div className="text-sm text-muted-foreground">Lendo agora</div>
            <div className="text-2xl font-bold text-card-foreground">{stats.reading}</div>
          </div>
          <div className="p-4 bg-card border border-border rounded-lg shadow-sm"> 
            <div className="text-sm text-muted-foreground">Lidos</div>
            <div className="text-2xl font-bold text-card-foreground">{stats.read}</div>
          </div>
          <div className="p-4 bg-card border border-border rounded-lg shadow-sm"> 
            <div className="text-sm text-muted-foreground">Páginas lidas</div>
            <div className="text-2xl font-bold text-card-foreground">{stats.totalPages.toLocaleString()}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-card border border-border rounded-lg shadow-sm">
            <div className="text-sm text-muted-foreground">Quero ler</div>
            <div className="text-2xl font-bold text-card-foreground">{stats.wantToRead}</div>
          </div>
          <div className="p-4 bg-card border border-border rounded-lg shadow-sm">
            <div className="text-sm text-muted-foreground">Pausados</div>
            <div className="text-2xl font-bold text-card-foreground">{stats.paused}</div>
          </div>
          <div className="p-4 bg-card border border-border rounded-lg shadow-sm">
            <div className="text-sm text-muted-foreground">Avaliação média</div>
            <div className="text-2xl font-bold text-card-foreground">
              {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : '--'}
            </div>
          </div>
        </div>

        <div className="bg-card border border-border p-6 rounded-lg shadow-sm">
          <h2 className="font-semibold mb-2 text-card-foreground">Bem-vindo ao BookShelf</h2>
          <p className="text-sm text-muted-foreground">
            Use o menu acima para navegar. Você pode começar adicionando um novo livro ou explorando sua biblioteca atual.
          </p>
          <div className="mt-4 flex gap-4 text-sm">
            <span className="text-muted-foreground">
              <strong className="text-foreground">{stats.total}</strong> livros na sua biblioteca
            </span>
            {stats.total > 0 && (
              <span className="text-muted-foreground">
                <strong className="text-foreground">{Math.round((stats.read / stats.total) * 100)}%</strong> lidos
              </span>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
