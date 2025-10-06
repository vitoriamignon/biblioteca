export type BookStatus = 'QUERO_LER' | 'LENDO' | 'LIDO' | 'PAUSADO' | 'ABANDONADO';

export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string; // Nome do gênero (vem da relação)
  year: number;
  pages: number;
  rating: number;
  synopsis: string;
  cover: string | null;
  status: BookStatus;
  currentPage: number;
  isbn: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  genreId?: string | null; // ID da relação (opcional)
}