"use client";

import React, { useState, useTransition } from "react";
import { Book } from "@/lib/types";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { createBook, updateBook } from "@/lib/actions";
import Image from "next/image";

type Props = {
  initial?: Partial<Book>;
  isEditing?: boolean;
  bookId?: string;
  onCancel?: () => void;
};

export function BookForm({ initial = {}, isEditing = false, bookId, onCancel }: Props) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>("");

  const handleSubmit = async (formData: FormData) => {
    setError("");
    
    startTransition(async () => {
      try {
        if (isEditing && bookId) {
          await updateBook(bookId, formData);
        } else {
          await createBook(formData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ocorreu um erro');
      }
    });
  };

  const statusOptions = [
    { value: 'QUERO_LER', label: 'Quero Ler' },
    { value: 'LENDO', label: 'Lendo' },
    { value: 'LIDO', label: 'Lido' },
    { value: 'PAUSADO', label: 'Pausado' },
    { value: 'ABANDONADO', label: 'Abandonado' }
  ];

  return (
    <div className="bg-card border border-border p-6 rounded-lg shadow-sm">
      <form action={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Preview da capa */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-foreground mb-2">
              Preview da Capa
            </label>
            <div className="w-48 h-60 mb-4 relative bg-muted rounded-lg overflow-hidden">
              {initial.cover ? (
                <Image 
                  src={initial.cover} 
                  alt={String(initial.title ?? "Capa do livro")} 
                  fill 
                  style={{ objectFit: "cover" }}
                  className="rounded-lg"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <div className="text-2xl mb-2">📖</div>
                    <p className="text-xs">Preview da capa</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Campos do formulário */}
          <div className="col-span-2 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-foreground mb-1">
                  Título *
                </label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  defaultValue={initial.title ?? ""}
                  placeholder="Digite o título do livro"
                  required
                  disabled={isPending}
                />
              </div>

              <div>
                <label htmlFor="author" className="block text-sm font-medium text-foreground mb-1">
                  Autor *
                </label>
                <Input
                  id="author"
                  name="author"
                  type="text"
                  defaultValue={initial.author ?? ""}
                  placeholder="Nome do autor"
                  required
                  disabled={isPending}
                />
              </div>

              <div>
                <label htmlFor="genre" className="block text-sm font-medium text-foreground mb-1">
                  Gênero *
                </label>
                <Input
                  id="genre"
                  name="genre"
                  type="text"
                  defaultValue={initial.genre ?? ""}
                  placeholder="Ex: Ficção, Romance, Técnico"
                  required
                  disabled={isPending}
                />
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-foreground mb-1">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  defaultValue={initial.status ?? 'QUERO_LER'}
                  disabled={isPending}
                  className="w-full border border-border rounded px-3 py-2 bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="year" className="block text-sm font-medium text-foreground mb-1">
                  Ano de Publicação *
                </label>
                <Input
                  id="year"
                  name="year"
                  type="number"
                  min="1000"
                  max={new Date().getFullYear() + 10}
                  defaultValue={initial.year ?? ""}
                  placeholder="2023"
                  required
                  disabled={isPending}
                />
              </div>

              <div>
                <label htmlFor="pages" className="block text-sm font-medium text-foreground mb-1">
                  Número de Páginas *
                </label>
                <Input
                  id="pages"
                  name="pages"
                  type="number"
                  min="1"
                  defaultValue={initial.pages ?? ""}
                  placeholder="350"
                  required
                  disabled={isPending}
                />
              </div>

              <div>
                <label htmlFor="rating" className="block text-sm font-medium text-foreground mb-1">
                  Avaliação (0-5 estrelas)
                </label>
                <Input
                  id="rating"
                  name="rating"
                  type="number"
                  min="0"
                  max="5"
                  step="1"
                  defaultValue={initial.rating ?? 0}
                  disabled={isPending}
                />
              </div>

              <div>
                <label htmlFor="cover" className="block text-sm font-medium text-foreground mb-1">
                  URL da Capa
                </label>
                <Input
                  id="cover"
                  name="cover"
                  type="url"
                  defaultValue={initial.cover ?? ""}
                  placeholder="https://exemplo.com/capa.jpg"
                  disabled={isPending}
                />
              </div>
            </div>

            <div>
              <label htmlFor="synopsis" className="block text-sm font-medium text-foreground mb-1">
                Sinopse
              </label>
              <textarea
                id="synopsis"
                name="synopsis"
                rows={4}
                defaultValue={initial.synopsis ?? ""}
                placeholder="Descreva brevemente sobre o que é o livro..."
                disabled={isPending}
                className="w-full border border-border rounded px-3 py-2 bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent resize-vertical"
              />
            </div>
          </div>
        </div>

        {/* Botões de ação */}
        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          {onCancel && (
            <Button 
              type="button"
              variant="outline" 
              onClick={onCancel}
              disabled={isPending}
            >
              Cancelar
            </Button>
          )}
          
          <Button 
            type="submit"
            disabled={isPending}
            className="min-w-[120px]"
          >
            {isPending ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                {isEditing ? 'Salvando...' : 'Criando...'}
              </div>
            ) : (
              isEditing ? 'Salvar Alterações' : 'Adicionar Livro'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}