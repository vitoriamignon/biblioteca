
"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Book } from "@/lib/types";
import { BookCard } from "../book-card";
import { Input } from "../ui/input";

interface BookListProps {
  initialBooks: Book[];
  genres?: string[];
  currentFilters?: {
    search: string;
    genre: string;
  };
}

export function BookList({ initialBooks, genres = [], currentFilters }: BookListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [searchTerm, setSearchTerm] = useState(currentFilters?.search || "");
  const [filterGenre, setFilterGenre] = useState(currentFilters?.genre || "all");

  // Gerar lista de gêneros disponíveis
  const availableGenres = useMemo(() => {
    const bookGenres = Array.from(new Set(initialBooks.map((book) => book.genre)));
    const allGenres = genres.length > 0 ? genres : bookGenres;
    return ["all", ...allGenres];
  }, [initialBooks, genres]);

  // Filtrar livros baseado nos filtros atuais
  const filteredBooks = useMemo(() => {
    return initialBooks.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.genre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.synopsis.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesGenre =
        filterGenre === "all" || book.genre === filterGenre;
      
      return matchesSearch && matchesGenre;
    });
  }, [initialBooks, searchTerm, filterGenre]);

  // Atualizar URL quando os filtros mudarem
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (searchTerm && searchTerm.trim() !== '') {
      params.set('search', searchTerm.trim());
    }
    
    if (filterGenre && filterGenre !== 'all') {
      params.set('genre', filterGenre);
    }

    const queryString = params.toString();
    const newUrl = queryString ? `?${queryString}` : '/library';
    
    // Apenas atualizar a URL se ela mudou
    if (window.location.search !== (queryString ? `?${queryString}` : '')) {
      router.replace(newUrl, { scroll: false });
    }
  }, [searchTerm, filterGenre, router]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterGenre(e.target.value);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterGenre("all");
  };

  return (
    <div className="flex flex-col items-center">
      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8 w-full max-w-2xl">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Buscar por título, autor, gênero ou sinopse..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full"
          />
        </div>
        
        <div className="w-full sm:w-[200px]">
          <select
            className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={filterGenre}
            onChange={handleGenreChange}
          >
            <option value="all">Todos os Gêneros</option>
            {availableGenres.slice(1).map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>

        {(searchTerm || filterGenre !== 'all') && (
          <button
            onClick={clearFilters}
            className="px-3 py-2 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors whitespace-nowrap border border-border"
          >
            Limpar filtros
          </button>
        )}
      </div>

      {/* Contadores e info */}
      <div className="w-full max-w-2xl mb-6 text-center text-sm text-muted-foreground">
        {filteredBooks.length !== initialBooks.length ? (
          <p>
            Mostrando <strong className="text-foreground">{filteredBooks.length}</strong> de{" "}
            <strong className="text-foreground">{initialBooks.length}</strong> livros
          </p>
        ) : (
          <p>
            <strong className="text-foreground">{initialBooks.length}</strong>{" "}
            {initialBooks.length === 1 ? "livro" : "livros"} na biblioteca
          </p>
        )}
      </div>

      {/* Lista de livros */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center w-full">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground mb-4">
              {searchTerm || filterGenre !== 'all' 
                ? "Nenhum livro encontrado com os filtros aplicados." 
                : "Nenhum livro encontrado na biblioteca."}
            </p>
            {(searchTerm || filterGenre !== 'all') && (
              <button
                onClick={clearFilters}
                className="text-primary hover:text-primary/80 underline font-medium"
              >
                Limpar filtros
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}