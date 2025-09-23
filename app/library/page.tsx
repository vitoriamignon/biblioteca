
import { BookList } from "@/components/book-list";
import { getBooks, getGenres } from "@/lib/actions";
import { Suspense } from "react";

interface LibraryPageProps {
  searchParams: Promise<{
    search?: string;
    genre?: string;
    status?: string;
  }>;
}

export default async function LibraryPage({ searchParams }: LibraryPageProps) {
  // Aguardar os searchParams
  const params = await searchParams;
  
  // Buscar dados no servidor
  const booksPromise = getBooks({
    search: params.search,
    genre: params.genre,
    status: params.status as any
  });
  
  const genresPromise = getGenres();

  // Aguardar ambas as promises
  const [books, genres] = await Promise.all([booksPromise, genresPromise]);

  return (
    <main className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">Minha Biblioteca</h1>
      <Suspense fallback={<div className="text-center">Carregando livros...</div>}>
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
  );
}