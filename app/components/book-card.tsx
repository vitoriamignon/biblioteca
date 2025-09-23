"use client";

import { Book } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  const statusLabels = {
    'QUERO_LER': 'Quero Ler',
    'LENDO': 'Lendo',
    'LIDO': 'Lido',
    'PAUSADO': 'Pausado',
    'ABANDONADO': 'Abandonado'
  };

  const statusColors = {
    'QUERO_LER': 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200 border border-blue-200 dark:border-blue-800',
    'LENDO': 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200 border border-green-200 dark:border-green-800',
    'LIDO': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700',
    'PAUSADO': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-800',
    'ABANDONADO': 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200 border border-red-200 dark:border-red-800'
  };

  return (
    <Card className="w-[320px] h-full flex flex-col hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <CardTitle>
          <div className="text-lg line-clamp-2" title={book.title}>{book.title}</div>
        </CardTitle>
        <CardDescription>
          <div className="line-clamp-1" title={book.author}>{book.author}</div>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex flex-col items-center flex-grow">
        {/* Capa do livro */}
        <div className="h-40 w-28 relative rounded-md overflow-hidden mb-4 flex-shrink-0">
          {book.cover ? (
            <Image
              src={book.cover}
              alt={`Capa de ${book.title}`}
              fill
              sizes="(max-width: 768px) 112px, 112px"
              style={{ objectFit: "cover" }}
              className="rounded-md"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground rounded-md">
              <div className="text-center">
                <div className="text-2xl mb-1">📖</div>
                <p className="text-xs">Sem capa</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Informações do livro */}
        <div className="text-sm text-center space-y-2 flex-grow">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-muted-foreground">Ano:</span>
              <div className="font-medium">{book.year}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Páginas:</span>
              <div className="font-medium">{book.pages}</div>
            </div>
            <div className="col-span-2">
              <span className="text-muted-foreground">Gênero:</span>
              <div className="font-medium line-clamp-1" title={book.genre}>{book.genre}</div>
            </div>
          </div>

          {book.rating > 0 && (
            <div className="flex items-center justify-center gap-1 text-yellow-500">
              {"★".repeat(book.rating)}{"☆".repeat(5 - book.rating)}
              <span className="text-muted-foreground ml-1">({book.rating})</span>
            </div>
          )}

          <div className="pt-2">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColors[book.status]}`}>
              {statusLabels[book.status]}
            </span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-center gap-2 pt-2">
        <Link href={`/library/${book.id}`}>
          <Button variant="outline" className="text-xs px-3 py-1 font-medium">
            Ver detalhes
          </Button>
        </Link>
        
        <Link href={`/library/${book.id}/edit`}>
          <Button className="text-xs px-3 py-1 font-medium">
            Editar
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}