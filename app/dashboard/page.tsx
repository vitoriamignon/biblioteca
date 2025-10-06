// dashboard/page.tsx - USE ESTA VERSÃO (A ORIGINAL)
import { getStats } from "@/lib/actions";
import Link from "next/link";
import { Navigation } from "@/components/navigation";

const BookIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const ReadingIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const HeartIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const PauseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const PagesIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const StarIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);
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
      <main className="container mx-auto py-12 px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Acompanhe o progresso da sua biblioteca pessoal</p>
          </div>
          <div className="flex gap-3">
            <Link 
              href="/library" 
              className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent hover:text-accent-foreground transition-all duration-200 hover:shadow-md"
            >
              <BookIcon />
              Ver biblioteca
            </Link>
            <Link 
              href="/library/add" 
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200 hover:shadow-md hover:scale-105"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Adicionar livro
            </Link>
          </div>
        </div>

        {/* Estatísticas principais - USE stats DIRETAMENTE */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"> 
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <BookIcon />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-card-foreground">{stats.total}</div>
                <div className="text-sm text-muted-foreground">Total de livros</div>
              </div>
            </div>
          </div>
          
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"> 
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <ReadingIcon />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-card-foreground">{stats.reading}</div>
                <div className="text-sm text-muted-foreground">Lendo agora</div>
              </div>
            </div>
          </div>
          
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"> 
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <CheckIcon />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-card-foreground">{stats.read}</div>
                <div className="text-sm text-muted-foreground">Lidos</div>
              </div>
            </div>
          </div>
          
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"> 
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <PagesIcon />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-card-foreground">{stats.totalPages.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Páginas lidas</div>
              </div>
            </div>
          </div>
        </div>
       {/* Estatísticas secundárias */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-rose-50 dark:bg-rose-900/20 rounded-lg">
                <HeartIcon />
              </div>
              <div>
                <div className="text-2xl font-bold text-card-foreground">{stats.wantToRead}</div>
                <div className="text-sm text-muted-foreground">Quero ler</div>
              </div>
            </div>
          </div>
          
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <PauseIcon />
              </div>
              <div>
                <div className="text-2xl font-bold text-card-foreground">{stats.paused}</div>
                <div className="text-sm text-muted-foreground">Pausados</div>
              </div>
            </div>
          </div>
          
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <StarIcon />
              </div>
              <div>
                <div className="text-2xl font-bold text-card-foreground">
                  {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : '--'}
                </div>
                <div className="text-sm text-muted-foreground">Avaliação média</div>
              </div>
            </div>
            {stats.averageRating > 0 && (
              <div className="text-xs text-muted-foreground mt-1">
                {stats.read > 0 ? `${stats.read} livros avaliados` : 'Sem avaliações'}
              </div>
            )}
          </div>
        </div>

        {/* Card de boas-vindas */}
        <div className="bg-gradient-to-br from-primary/10 via-purple-50 to-pink-50 dark:from-primary/20 dark:via-purple-900/20 dark:to-pink-900/20 border border-border/50 p-8 rounded-xl shadow-sm">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-card-foreground mb-2">Bem-vindo ao BookShelf</h2>
              <p className="text-muted-foreground max-w-2xl">
                Organize sua biblioteca pessoal, acompanhe seu progresso de leitura e descubra novos mundos através dos livros.
              </p>
            </div>
            <div className="hidden md:block">
              <BookIcon />
            </div>
          </div>
          
          {stats.total > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">Progresso de Leitura</h3>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Livros lidos</span>
                    <span className="font-medium">{Math.round((stats.read / stats.total) * 100)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-primary to-purple-500 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${Math.round((stats.read / stats.total) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">Estatísticas Rápidas</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center p-2 bg-background/50 rounded-lg">
                    <div className="font-bold text-lg text-foreground">{stats.total}</div>
                    <div className="text-muted-foreground">Total</div>
                  </div>
                  <div className="text-center p-2 bg-background/50 rounded-lg">
                    <div className="font-bold text-lg text-foreground">{stats.reading}</div>
                    <div className="text-muted-foreground">Lendo</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Sua biblioteca está vazia</h3>
              <p className="text-muted-foreground mb-6">Comece adicionando seu primeiro livro para começar a organizar sua coleção.</p>
              <Link 
                href="/library/add"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200 hover:shadow-md hover:scale-105"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Adicionar primeiro livro
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}