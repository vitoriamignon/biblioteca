"use client";

import { useState, useTransition } from "react";
import { deleteBook } from "@/lib/actions";
import { Button } from "@/components/ui/button";

interface DeleteBookButtonProps {
  bookId: string;
  bookTitle: string;
}

export function DeleteBookButton({ bookId, bookTitle }: DeleteBookButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>("");

  const handleDelete = () => {
    setError("");
    
    startTransition(async () => {
      try {
        await deleteBook(bookId);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao excluir livro');
        setShowConfirm(false);
      }
    });
  };

  if (showConfirm) {
    return (
      <div className="flex flex-col gap-2">
        {error && (
          <p className="text-destructive text-sm">{error}</p>
        )}
        
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <p className="text-sm text-foreground mb-3">
            Tem certeza que deseja excluir "{bookTitle}"? Esta ação não pode ser desfeita.
          </p>
          
          <div className="flex gap-2">
            <Button
              onClick={handleDelete}
              disabled={isPending}
              variant="destructive"
              className="text-sm"
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  Excluindo...
                </div>
              ) : (
                "Sim, excluir"
              )}
            </Button>
            
            <Button
              onClick={() => setShowConfirm(false)}
              disabled={isPending}
              variant="outline"
              className="text-sm"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Button
      onClick={() => setShowConfirm(true)}
      variant="destructive"
      className="text-sm"
    >
      🗑️ Excluir
    </Button>
  );
}