"use client";

import React, { useEffect, useState } from "react";
import { BookForm } from "@/components/book-form-server";
import { getBook } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { Book } from "@/lib/types";

export default function EditBookClient({ bookId }: { bookId: string }) {
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const fetchedBook = await getBook(bookId);
        setBook(fetchedBook);
        
        if (!fetchedBook) {
          setError("Livro não encontrado");
        }
      } catch (err) {
        setError("Erro ao carregar livro");
        console.error('Erro ao buscar livro:', err);
      } finally {
        setLoading(false);
      }
    };

    if (bookId) {
      fetchBook();
    }
  }, [bookId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="w-5 h-5 border-2 border-muted-foreground/20 border-t-muted-foreground rounded-full animate-spin"></div>
          Carregando livro...
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="bg-card border border-border p-6 rounded-lg shadow-sm">
        <div className="text-center py-8">
          <div className="text-destructive mb-4">❌</div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {error || "Livro não encontrado"}
          </h3>
          <p className="text-muted-foreground mb-4">
            O livro que você está tentando editar não foi encontrado.
          </p>
          <button
            onClick={() => router.push("/library")}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Voltar à Biblioteca
          </button>
        </div>
      </div>
    );
  }

  return (
    <BookForm
      initial={book}
      isEditing={true}
      bookId={bookId}
      onCancel={() => router.push(`/library/${bookId}`)}
    />
  );
}
