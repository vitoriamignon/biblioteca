"use client";

import { Book } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  const statusLabels = {
    "QUERO_LER": "Quero Ler",
    "LENDO": "Lendo",
    "LIDO": "Lido",
    "PAUSADO": "Pausado",
    "ABANDONADO": "Abandonado"
  };

  const statusColors = {
    "QUERO_LER": "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300",
    "LENDO": "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300",
    "LIDO": "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300",
    "PAUSADO": "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300",
    "ABANDONADO": "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/20 dark:text-rose-300"
  };

  return (
    <Card className="group w-full max-w-sm h-full flex flex-col overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
      <CardHeader className="pb-4">
        <CardTitle>
          <h3 className="text-lg font-semibold line-clamp-2 leading-tight group-hover:text-primary transition-colors" title={book.title}>
            {book.title}
          </h3>
        </CardTitle>
        <CardDescription>
          <p className="line-clamp-1" title={book.author}>{book.author}</p>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex flex-col flex-grow space-y-4">
        <div className="flex justify-center">
          <div className="h-48 w-32 relative rounded-lg overflow-hidden shadow-md bg-muted">
            {book.cover ? (
              <Image
                src={book.cover}
                alt={`Capa de ${book.title}`}
                fill
                sizes="128px"
                style={{ objectFit: "cover" }}
                className="rounded-lg transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-3 flex-grow text-center">
          <div className="text-sm space-y-2">
            <div className="text-muted-foreground">{book.year} • {book.pages} páginas</div>
            <div className="text-muted-foreground line-clamp-1" title={book.genre}>{book.genre}</div>
          </div>

          {book.rating > 0 && (
            <div className="flex items-center justify-center gap-1">
              {"★".repeat(Math.floor(book.rating))}{"☆".repeat(5 - Math.floor(book.rating))}
              <span className="text-sm text-muted-foreground ml-2">({book.rating.toFixed(1)})</span>
            </div>
          )}

          <div className="flex justify-center">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusColors[book.status]}`}>
              {statusLabels[book.status]}
            </span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex gap-2 pt-4">
        <Link href={`/library/${book.id}`} className="flex-1">
          <Button variant="outline" className="w-full text-sm">
            Ver detalhes
          </Button>
        </Link>
        
        <Link href={`/library/${book.id}/edit`} className="flex-1">
          <Button className="w-full text-sm">
            Editar
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}