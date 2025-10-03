import { getStats } from "@/lib/actions";
import Link from "next/link";
import { Navigation } from "@/components/navigation";

export default async function DashboardPage() {
  // Buscar dados no servidor
  const stats = await getStats();

  // Calcular porcentagens
  const readPercentage = stats.total > 0 ? Math.round((stats.read / stats.total) * 100) : 0;
  const readingPercentage = stats.total > 0 ? Math.round((stats.reading / stats.total) * 100) : 0;
  const wantToReadPercentage = stats.total > 0 ? Math.round((stats.wantToRead / stats.total) * 100) : 0;

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

        {/* ⬇️ ATUALIZADO: Grid principal com todos os status */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-card border border-border rounded-lg shadow-sm"> 
            <div className="text-sm text-muted-foreground">Total de livros</div>
            <div className="text-2xl font-bold text-card-foreground">{stats.total}</div>
          </div>
          <div className="p-4 bg-card border border-border rounded-lg shadow-sm"> 
            <div className="text-sm text-muted-foreground">Lendo agora</div>
            <div className="text-2xl font-bold text-card-foreground">{stats.reading}</div>
            {stats.total > 0 && (
              <div className="text-xs text-muted-foreground mt-1">{readingPercentage}% da biblioteca</div>
            )}
          </div>
          <div className="p-4 bg-card border border-border rounded-lg shadow-sm"> 
            <div className="text-sm text-muted-foreground">Lidos</div>
            <div className="text-2xl font-bold text-card-foreground">{stats.read}</div>
            {stats.total > 0 && (
              <div className="text-xs text-muted-foreground mt-1">{readPercentage}% da biblioteca</div>
            )}
          </div>
          <div className="p-4 bg-card border border-border rounded-lg shadow-sm"> 
            <div className="text-sm text-muted-foreground">Páginas lidas</div>
            <div className="text-2xl font-bold text-card-foreground">{stats.totalPages.toLocaleString()}</div>
          </div>
        </div>

        {/* ⬇️ ATUALIZADO: Grid secundário com todos os status */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-card border border-border rounded-lg shadow-sm">
            <div className="text-sm text-muted-foreground">Quero ler</div>
            <div className="text-2xl font-bold text-card-foreground">{stats.wantToRead}</div>
            {stats.total > 0 && (
              <div className="text-xs text-muted-foreground mt-1">{wantToReadPercentage}% da biblioteca</div>
            )}
          </div>
          <div className="p-4 bg-card border border-border rounded-lg shadow-sm">
            <div className="text-sm text-muted-foreground">Pausados</div>
            <div className="text-2xl font-bold text-card-foreground">{stats.paused}</div>
            {stats.total > 0 && (
              <div className="text-xs text-muted-foreground mt-1">
                {Math.round((stats.paused / stats.total) * 100)}% da biblioteca
              </div>
            )}
          </div>
          <div className="p-4 bg-card border border-border rounded-lg shadow-sm">
            <div className="text-sm text-muted-foreground">Abandonados</div>
            <div className="text-2xl font-bold text-card-foreground">{stats.abandoned}</div>
            {stats.total > 0 && (
              <div className="text-xs text-muted-foreground mt-1">
                {Math.round((stats.abandoned / stats.total) * 100)}% da biblioteca
              </div>
            )}
          </div>
          <div className="p-4 bg-card border border-border rounded-lg shadow-sm">
            <div className="text-sm text-muted-foreground">Avaliação média</div>
            <div className="text-2xl font-bold text-card-foreground">
              {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : '--'}
            </div>
            {stats.averageRating > 0 && (
              <div className="text-xs text-muted-foreground mt-1">
                {stats.read > 0 ? `${stats.read} livros avaliados` : 'Sem avaliações'}
              </div>
            )}
          </div>
        </div>

        {/* ⬇️ ATUALIZADO: Resumo com mais informações */}
        <div className="bg-card border border-border p-6 rounded-lg shadow-sm">
          <h2 className="font-semibold mb-2 text-card-foreground">Resumo da Sua Biblioteca</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Uma visão geral do seu progresso de leitura e da sua coleção de livros.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Total:</span>
              <strong className="text-foreground ml-1">{stats.total}</strong>
            </div>
            <div>
              <span className="text-muted-foreground">Lidos:</span>
              <strong className="text-foreground ml-1">{stats.read} ({readPercentage}%)</strong>
            </div>
            <div>
              <span className="text-muted-foreground">Lendo:</span>
              <strong className="text-foreground ml-1">{stats.reading} ({readingPercentage}%)</strong>
            </div>
            <div>
              <span className="text-muted-foreground">Páginas:</span>
              <strong className="text-foreground ml-1">{stats.totalPages.toLocaleString()}</strong>
            </div>
          </div>
          
          {/* ⬇️ NOVO: Barra de progresso visual */}
          {stats.total > 0 && (
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progresso geral de leitura:</span>
                <span className="font-medium">{readPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${readPercentage}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* ⬇️ NOVO: Cards de ação rápida */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <Link 
            href="/library/add" 
            className="p-4 bg-primary/10 border border-primary/20 rounded-lg hover:bg-primary/20 transition-colors group"
          >
            <div className="text-primary font-semibold mb-1">➕ Adicionar Livro</div>
            <div className="text-sm text-muted-foreground">Cadastre um novo livro na sua biblioteca</div>
          </Link>
          
          <Link 
            href="/library?status=LENDO" 
            className="p-4 bg-green-100 border border-green-200 rounded-lg hover:bg-green-200 transition-colors group dark:bg-green-900/20 dark:border-green-800"
          >
            <div className="text-green-800 font-semibold mb-1 dark:text-green-300">📖 Continuar Lendo</div>
            <div className="text-sm text-muted-foreground">{stats.reading} livro(s) em progresso</div>
          </Link>
          
          <Link 
            href="/library?status=QUERO_LER" 
            className="p-4 bg-blue-100 border border-blue-200 rounded-lg hover:bg-blue-200 transition-colors group dark:bg-blue-900/20 dark:border-blue-800"
          >
            <div className="text-blue-800 font-semibold mb-1 dark:text-blue-300">📚 Próximas Leituras</div>
            <div className="text-sm text-muted-foreground">{stats.wantToRead} livro(s) na lista</div>
          </Link>
        </div>
      </main>
    </div>
  );
}