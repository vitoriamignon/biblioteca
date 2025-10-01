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
    <main className="container relative mx-auto py-10">
      <BackButton />

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