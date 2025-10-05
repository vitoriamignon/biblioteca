"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Book } from "@/lib/types";
import { BookCard } from "../book-card";
import { Input } from "../ui/input";

// Ícones SVG
const SearchIcon = () => (
  <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const FilterIcon = () => (
  <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
  </svg>
);

const BookOpenIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

interface BookListProps {
  initialBooks: Book[];
  genres?: (string | { id: string; name: string })[];
  currentFilters?: {
    search: string;
    genre: string;
  };
}

export function BookList({ initialBooks, genres = [], currentFilters }: BookListProps) {
  const router = useRouter();
  
  const [searchTerm, setSearchTerm] = useState(currentFilters?.search || "");
  const [filterGenre, setFilterGenre] = useState(currentFilters?.genre || "all");

  // Gerar lista de gêneros disponíveis - CORRIGIDO
  const availableGenres = useMemo(() => {
    // Se genres for array de objetos, extrair nomes; se for strings, usar diretamente
    const genreNames = genres.length > 0 
      ? genres.map(g => typeof g === 'string' ? g : g.name)
      : Array.from(new Set(initialBooks.map((book) => book.genre)));
  
    return ["all", ...genreNames];
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
      <div className="bg-card border border-border rounded-xl p-6 mb-8 w-full max-w-4xl shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <FilterIcon />
          <h3 className="text-lg font-semibold text-card-foreground">Filtros</h3>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Input
                type="text"
                placeholder="Buscar por título, autor, gênero ou sinopse..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10 w-full"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <SearchIcon />
              </div>
            </div>
          </div>
          
          <div className="w-full lg:w-[250px]">
            <div className="relative">
              <select
                className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none pr-10"
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
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {(searchTerm || filterGenre !== 'all') && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-all duration-200 whitespace-nowrap border border-border hover:shadow-sm"
            >
              ✕ Limpar filtros
            </button>
          )}
        </div>
      </div>

      {/* Contadores e info */}
      <div className="w-full max-w-4xl mb-8">
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <BookOpenIcon />
          {filteredBooks.length !== initialBooks.length ? (
            <p className="text-center">
              Mostrando <span className="font-semibold text-foreground">{filteredBooks.length}</span> de{" "}
              <span className="font-semibold text-foreground">{initialBooks.length}</span> livros
            </p>
          ) : (
            <p className="text-center">
              <span className="font-semibold text-foreground">{initialBooks.length}</span>{" "}
              {initialBooks.length === 1 ? "livro" : "livros"} na biblioteca
            </p>
          )}
        </div>
      </div>

      {/* Lista de livros */}
      <div className="w-full max-w-7xl">
        {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
            {filteredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 text-muted-foreground/40">
                <BookOpenIcon />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {searchTerm || filterGenre !== 'all' 
                  ? "Nenhum livro encontrado" 
                  : "Sua biblioteca está vazia"}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm || filterGenre !== 'all' 
                  ? "Tente ajustar os filtros para encontrar o que procura." 
                  : "Comece adicionando alguns livros à sua coleção."}
              </p>
              {(searchTerm || filterGenre !== 'all') ? (
                <button
                  onClick={clearFilters}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200 font-medium hover:shadow-md"
                >
                  Limpar filtros
                </button>
              ) : (
                <a
                  href="/library/add"
                  className="inline-flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200 font-medium hover:shadow-md"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Adicionar primeiro livro
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}