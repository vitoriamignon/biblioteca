import { Suspense } from "react";
import { BookList } from "@/components/book-list";
import { BackButton } from "@/components/ui/backbutton";
import { getBooks, getGenres } from "@/lib/actions";
import { Book } from "@/lib/types";

interface LibraryPageProps {
  searchParams: {
    search?: string;
    genre?: string;
    status?: string;
  };
}

export default async function LibraryPage({ searchParams }: LibraryPageProps) {
  const booksPromise = getBooks({
    search: searchParams.search,
    genre: searchParams.genre,
    status: searchParams.status as Book['status'],
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
            search: searchParams.search || '',
            genre: searchParams.genre || 'all'
          }}
        />
      </Suspense>
    </main>
  );
}