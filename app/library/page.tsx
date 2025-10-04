import { Suspense } from "react";
import { BookList } from "@/components/book-list";
import { BackButton } from "@/components/ui/backbutton";
import { getBooks, getGenres } from "@/lib/actions";
import { Book } from "@/lib/types";

interface LibraryPageProps {
  searchParams: Promise<{
    search?: string;
    genre?: string;
    status?: string;
  }>;
}

export default async function LibraryPage({ searchParams }: LibraryPageProps) {
  const params = await searchParams;
  const booksPromise = getBooks({
    search: params.search,
    genre: params.genre,
    status: params.status as Book['status'],
  });
  
  const genresPromise = getGenres();

  const [books, genres] = await Promise.all([booksPromise, genresPromise]);

  return (
    <div className="min-h-screen bg-background">
      <main className="container relative mx-auto py-12 px-4">
        <BackButton />

        {/* Header da página */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Minha Biblioteca</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore e organize sua coleção pessoal de livros. Use os filtros para encontrar exatamente o que procura.
          </p>
        </div>
        
        <Suspense fallback={
          <div className="text-center py-16">
            <div className="inline-flex items-center gap-2 text-muted-foreground">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              Carregando livros...
            </div>
          </div>
        }>
          <BookList 
            initialBooks={books} 
            genres={genres}
            currentFilters={{
              search: params.search || '',
              genre: params.genre || 'all'
            }}
          />
        </Suspense>
      </main>
    </div>
  );
}